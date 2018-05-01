<?php

header('Content-type: application/json');
$json = file_get_contents('php://input');
$json_decode = json_decode($json, true);

class Prog {
    var $agences;
    var $lieuFormation;
    var $nbIte;
    var $solution;

    function Prog(){}

    function parserDonnees($json)
    {
        $this->agences = $json["agences"];
        $this->lieuFormation = $json["lieuFormation"];
        $this->nbIte  = $json["nbIte"];

        $this->solution = array();
        $this->solution["coutTotal"] = -1;
        $this->solution["listLieuFormationOuvert"] = array();
        $this->solution["listAgence"] = array();
    }

    function calculerDistance($var1, $var2){
        $lat1 = floatval($var1["latitude"]);
        $lat2 = floatval($var2["latitude"]);
        $long1 = floatval($var1["longitude"]);
        $long2 = floatval($var2["longitude"]);
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
        $matrice = $this->initMatriceVide($nbAgence, $nbLieuFormation);
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
            if($listLieuFormation[$i]["estOuvert"] == "true"){
                array_push($res, $listLieuFormation[$i]);
            }
        }
        return $res;
    }

    function coutLieuFormationOuvert($listLieuFormation){
        $nbLieuFormationOuvert = 0;
        for($i=0 ; $i<count($listLieuFormation) ; $i++){
            if($listLieuFormation[$i]["estOuvert"] == "true"){
                $nbLieuFormationOuvert++;
            }
        }
        return $nbLieuFormationOuvert*3000;
    }

    function calculCoutTransport($listAgence){
        $sum = 0.0;
        for($i=0 ; $i<count($listAgence) ; $i++){
            if($listAgence[$i]["idLieuDeFormation"] != "-1"){
                $id = $this->indexOfLieuFormation($listAgence[$i]["idLieuDeFormation"]);
                $sum += $listAgence[$i]["nbpersonnes"]*0.4*2*$this->calculerDistance($listAgence[$i],$this->lieuFormation[$id]);
            }
        }
        return $sum;
    }

    function indexOfLieuFormation($index){
        for($i=0 ; $i<count($this->lieuFormation) ; $i++)
        {
            if($this->lieuFormation[$i]["id"] == $index){
                return $i;
            }
        }
        return -1;
    }

    function fermerLieuFormation($listLieuFormation){
        for($i=0 ; $i<count($listLieuFormation) ; $i++){
            $listLieuFormation[$i]["estOuvert"] = 'false';
            $listLieuFormation[$i]["capaciteRestante"] = 60;
        }
        return $listLieuFormation;
    }

    function algoGenetique(){
        set_time_limit ( 120 );

        $coutInteressant = 1000;
        $coutTotal = 0;
        $matriceLieuDeFormationAgence = $this->genererMatriceLieuAgence($this->agences,$this->lieuFormation);
        //echo json_encode($matriceLieuDeFormationAgence);
        $ite = 0;
        //echo json_encode($this->agences);
        //echo json_encode($this->nbIte);
        //echo json_encode($this->agences);
        //echo json_encode($this->lieuFormation);
        while($ite<$this->nbIte){

            for($i=0 ; $i<count($this->agences) ; $i++){
                $agenceTraitee = false;
                while(!$agenceTraitee){
                    $rand = rand(0, count($matriceLieuDeFormationAgence[$i]) - 1);
                    $id = $this->indexOfLieuFormation($matriceLieuDeFormationAgence[$i][$rand]["id"]);
                    if($this->lieuFormation[$id]["capaciteRestante"] >= $this->agences[$i]["nbpersonnes"]){
                        $this->agences[$i]["idLieuDeFormation"] = $matriceLieuDeFormationAgence[$i][$rand]["id"];
                        $this->lieuFormation[$id]["capaciteRestante"] -= $this->agences[$i]["nbpersonnes"];
                        $this->lieuFormation[$id]["estOuvert"] = true;
                        $agenceTraitee = true;
                    }
                }
            }
            $coutTotal = $this->coutLieuFormationOuvert($this->lieuFormation) + $this->calculCoutTransport($this->agences);
            if($coutTotal < $coutInteressant)
            {
                for($i=0 ; $i<count($this->agences) ; $i++){
                    $id = $this->indexOfLieuFormation($this->agences[$i]["idLieuDeFormation"]);
                    $lieuFormationSelected = $this->lieuFormation[$id];
                    array_push($matriceLieuDeFormationAgence[$i], $lieuFormationSelected);
                }
                $coutInteressant = $coutTotal;
            }
            /*for($i=0 ; $i<count($this->agences) ; $i++){
                $id = $this->indexOfLieuFormation($this->agences[$i]["idLieuDeFormation"]);
                $lieuFormationSelected = $this->lieuFormation[$id];
                if($this->calculCoutTransport(array($this->agences[$i])) < 1000)
                {
                    for($j=0; $j<30; $j++)
                    {
                        array_push($matriceLieuDeFormationAgence[$i], $lieuFormationSelected);
                    }
                }
                if($this->calculCoutTransport(array($this->agences[$i])) < 500)
                {
                    for($j=0; $j<30; $j++)
                    {
                        array_push($matriceLieuDeFormationAgence[$i], $lieuFormationSelected);
                    }
                }
                if((60 - $lieuFormationSelected["capaciteRestante"])>$this->agences[$i]["nbpersonnes"])
                {
                    for($j=0; $j<50; $j++)
                    {
                        array_push($matriceLieuDeFormationAgence[$i], $lieuFormationSelected);
                    }
                }

            }*/

            $this->solution["coutTotal"] = $coutTotal;
            $this->solution["listLieuFormationOuvert"] = $this->genererListLieuFormationOuvert($this->lieuFormation);
            $this->solution["listAgence"] = $this->agences;
            $ite++;
            $this->lieuFormation = $this->fermerLieuFormation($this->lieuFormation);
        }
        //echo json_encode($this->agences);

        $this->afficherDonnees();
    }

    function afficherDonnees()
    {
        $json_encode = json_encode($this->solution);
        echo $json_encode;
    }

}

$prog = new Prog;
$prog->parserDonnees($json_decode);
$prog->algoGenetique();
