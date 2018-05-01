<?php
//$agences=[['id':'a', 'latitude'='2.5']];

/*$data = json_decode($_POST["data"], true);
$agences = $data["agences"];
$lieuFormation = $data["lieuFormation"];
$nbIte = $data["nbIte"];*/

$agences = json_decode($_POST["agences"], true);
$lieuFormation = json_decode($_POST["lieuFormation"], true);
$nbIte  = json_decode($_POST["nbIte"], true);

$solution = array();
$solution["coutTotal"] = -1;
$solution["listLieuFormationOuvert"] = array();
$solution["listAgence"] = array();


function calculerDistance($var1, $var2){
    $lat1 = floatval($var1["latitude"]);
    $lat2 = floatval($var2.["latitude"]);
    $long1 = floatval($var1["longitude"]);
    $long2 = floatval($var2.["longitude"]);
    $radlat1 = pi() * $lat1/180;
    $radlat2 = pi() * $lat2/180;
    $theta;
    if($long2 < $long1)
    {
        $theta = $long1-$long2;
    }
    else {
        $theta = $long2-$long1;
    }
    $radtheta = pi() * $theta/180;
    $dist = sin($radlat1) * sin($radlat2) + cos($radlat1) * cos($radlat2) * cos($radtheta);
    $dist = acos($dist);
    $dist = $dist * 180/pi();
    $dist = $dist * 60 * 1.1515;
    return $dist * 1.609344;
}

function initMatriceVide($nbCol, $nbLignes){
    $matrice = array();
    for($i=0 ; $i<$nbCol ; $i++){
        $matrice[$i] = array();
        for($j=0 ; $j<$nbLignes ; $j++){
            $matrice[$i][$j] = 0;
        }
    }
    return $matrice;
}

function genererMatriceDistance($listAgence, $listLieuFormation){
    $nbAgence = count($listAgence);
    $nbLieuFormation = count($listLieuFormation);
    $matrice = initMatriceVide($nbAgence, $nbLieuFormation);
    for($i=0 ; $i<$nbAgence ; $i++){
        for($j=0 ; $j<$nbLieuFormation ; $j++){
            $matrice[$i][$j] = floatval(calculerDistance($listAgence[$i],$listLieuFormation[$j]));
        }
    }
    return $matrice;
}

function genererMatriceLieuAgence($listAgence, $listLieuFormation){
    $nbAgence = count($listAgence);
    $nbLieuFormation = count($listLieuFormation);
    $matrice = initMatriceVide($nbAgence, $nbLieuFormation);
    for($i=0 ; $i<$nbAgence ; $i++){
        for($j=0 ; $j<$nbLieuFormation ; $j++){
            $matrice[$i][$j] = $listLieuFormation[$j];
        }
    }
    return $matrice;
}

function genererListLieuFormationOuvert($listLieuFormation){
    $res = array();
    for($i=0 ; $i<count($listLieuFormation) ; $i++){
        if($listLieuFormation[$i]["estOuvert"] == true){
            array_push($res, $listLieuFormation[$i]);
        }
    }
    return $res;
}

function coutLieuFormationOuvert($listLieuFormation){
    $nbLieuFormationOuvert = 0;
    for($i=0 ; $i<count($listLieuFormation) ; $i++){
        if($listLieuFormation[$i]["estOuvert"] == true){
            $nbLieuFormationOuvert++;
        }
    }
    return $nbLieuFormationOuvert*3000;
}

function calculCoutTransport($listAgence){
    $sum = 0.0;
    for($i=0 ; $i<count($listAgence) ; $i++){
        if($listAgence[$i].["idLieuDeFormation"] != "-1"){
            $id = indexOfLieuFormation($listAgence[$i]["idLieuDeFormation"]);
            $sum += $listAgence[$i]["nbpersonnes"]*0.4*calculerDistance($listAgence[$i],$lieuFormation[$id]);
        }
    }
    return $sum;
}

function indexOfLieuFormation($index){
    for($i=0 ; $i<count($lieuFormation) ; $i++)
    {
        if($lieuFormation[$i].["id"] == $index){
            return $i;
        }
    }
    return -1;
}

function fermerLieuFormation($listLieuFormation){
    for($i=0 ; $i<count($listLieuFormation) ; $i++){
        $listLieuFormation[$i]["estOuvert"] = 'false';
    }
    return $listLieuFormation;
}

function algoGenetique($nbIte){

    $coutInteressant = 1000000;
    $coutTotal = 0;

//    var matriceDistance = main.genererMatriceDistance(listAgence,main.data.lieuFormation);
    $matriceLieuDeFormationAgence = genererMatriceLieuAgence($agences,$lieuFormation);

    $ite = 0;
    while($ite<$nbIte){

        for($i=0 ; $i<count($agences) ; $i++){
            $agenceTraitee = false;
            while(!$agenceTraitee){
                $rand = floor(rand(0, 1) * count($matriceLieuDeFormationAgence[$i]));
                $id = indexOfLieuFormation($matriceLieuDeFormationAgence[$i][$rand]["id"]);
                if($lieuFormation[$id]["capaciteRestante"] >= $agences[$i]["nbpersonnes"]){
                    $agences[$i]["idLieuDeFormation"] = $matriceLieuDeFormationAgence[$i][$rand]["id"];
                    $lieuFormation[$id]["capaciteRestante"] -= $agences[$i]["nbpersonnes"];
                    $lieuFormation[$id]["estOuvert"] = true;
                    $agenceTraitee = true;
                }
            }
        }
        $coutTotal = coutLieuFormationOuvert($lieuFormation) + calculCoutTransport($agences);
        if($coutTotal < $coutInteressant)
        {
            for($i=0 ; $i<count($agences) ; $i++){
                $id = indexOfLieuFormation($agences[$i]["idLieuDeFormation"]);
                $lieuFormation = $lieuFormation[$id];
                array_push($matriceLieuDeFormationAgence[$i], $lieuFormation);
            }
            $coutInteressant = $coutTotal;
        }
        $solution["coutTotal"] = $coutTotal;
        $solution["listLieuFormationOuvert"] = genererListLieuFormationOuvert($lieuFormation);
        $solution["listAgence"] = $agences;
        $ite++;
        //console.log("Itération numéro" + ite);
        $lieuFormation = fermerLieuFormation($lieuFormation);
    }
    //matriceLieuDeFormationAgence = null;

    //echo(json_encode($solution));

    return $solution;
}
echo($nbIte);

algoGenetique($nbIte);
