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


    // Cette fonction permet d'enregistrer les données fournies via l'interface web
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

    // A partir d'une liste de lieu de formation, retourne ceux qui sont ouvert
    function coutLieuFormationOuvert($listLieuFormation){
        $nbLieuFormationOuvert = 0;
        for($i=0 ; $i<count($listLieuFormation) ; $i++){
            if($listLieuFormation[$i]["estOuvert"] == "true"){
                $nbLieuFormationOuvert++;
            }
        }
        return $nbLieuFormationOuvert*3000;
    }

    // Calcul le cout de transport d'une liste d'agence
    // A chaque agence, le cout est égal à nbPersonnes de l'agence*cout Kilomètrique*distance entre le lieu de formation lié à cette agence
    // On multiplie enfin le résultat par 2 pour prendre en compte l'aller/retour
    function calculCoutTransport($listAgence){
        $sum = 0.0;
        for($i=0 ; $i<count($listAgence) ; $i++){
            $id = $listAgence[$i]["indexOfLieuFormation"];
            $sum += $listAgence[$i]["nbpersonnes"]*0.4*$this->calculerDistance($listAgence[$i],$this->lieuFormation[$id]);
        }
        return 2.0*$sum;
    }

    //Calcule la distance entre 2 lieux passer en paramètres
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

    //On génére une solution une solution initiale de manière aléatoire.
    function genererSolutionInit(){
        for($i=0 ; $i<count($this->agences) ; $i++){
            $agenceTraitee = false;
            while(!$agenceTraitee){
                $rand = rand(0, count($this->lieuFormation) - 1);
                if($this->lieuFormation[$rand]["capaciteRestante"] >= $this->agences[$i]["nbpersonnes"]){
                    $this->agences[$i]["idLieuDeFormation"] = $this->lieuFormation[$rand]["id"];
                    $this->agences[$i]["indexOfLieuFormation"] = $rand;
                    $this->lieuFormation[$rand]["capaciteRestante"] -= $this->agences[$i]["nbpersonnes"];
                    $this->lieuFormation[$rand]["estOuvert"] = true;
                    $agenceTraitee = true;
                }
            }
        }
        $coutTotal = $this->coutLieuFormationOuvert($this->lieuFormation) + $this->calculCoutTransport($this->agences);
        $this->solution["coutTotal"] = $coutTotal;
        $this->solution["listLieuFormationOuvert"] = $this->genererListLieuFormationOuvert($this->lieuFormation);
        $this->solution["listAgence"] = $this->agences;
        //$this->solution["lieuFormNbPersLeft"]=$this->genererLieuFormNbPersLeft($this->agences,$this->lieuFormation);

    }

    //Via une liste de formation on retourne une liste ne contenant que les lieux de formations ouverts
    function genererListLieuFormationOuvert($lf){
        $res = array();
        for($i=0 ; $i<count($lf) ; $i++){
            if($lf[$i]["estOuvert"] == true){
                array_push($res, $lf[$i]);
            }
        }
        return $res;
    }

    //Retourne le meilleur voisin d'un échantillon du voisinage d'un parent
    // On ne génére pas l'ensemble du voisinage pour diminuer le temps de calcul.
    // On génére un voisage de la taille du nombre d'agenceParent
    // On a une probabilité de 1/2 d'affecter l'agence à un lieu de formation déjà ouvert ou à un nouveau lieu de formation
    // Le cout de la nouvelle solution est calculée en recalculant seulement la modification apportée et non l'ensemble de coutTotal
    function genererVoisinage($parent,$nbAgence,$lfParent){
        $voisin;
        $prixMeilleurVoisin = 1000000000;
        for($i = 0;$i<$nbAgence;$i++){
            $coutVoisin = $parent["coutTotal"];
            $lfTemp = $lfParent;
            $agenceParent = $parent["listAgence"];
            $choixRandom = rand(0,1);
            if($choixRandom == 0){
                $rand = rand(0,count($parent["listAgence"]) - 1);
                $random = $parent["listAgence"][$rand]["indexOfLieuFormation"];
            }else{
                $random = rand(0,count($lfTemp)-1);
            }
            $agenceTraitee = false;
            $indexOldLF = $agenceParent[$i]["indexOfLieuFormation"];
            while(!$agenceTraitee){
                if($lfTemp[$random]["capaciteRestante"] >= $agenceParent[$i]["nbpersonnes"]){
                    $agenceParent[$i]["idLieuDeFormation"] = $lfTemp[$random]["id"];
                    $agenceParent[$i]["indexOfLieuFormation"] = $random;
                    $lfTemp[$random]["capaciteRestante"] -= $agenceParent[$i]["nbpersonnes"];
                    if($lfTemp[$random]["estOuvert"] == false){
                        $lfTemp[$random]["estOuvert"] = true;
                        $coutVoisin += 3000;
                    }
                    $coutVoisin += 2*$agenceParent[$i]["nbpersonnes"]*0.4*$this->calculerDistance($agenceParent[$i],$lfTemp[$random]);

                    $lfTemp[$indexOldLF]["capaciteRestante"] += $agenceParent[$i]["nbpersonnes"];
                    $coutVoisin -= 2*$agenceParent[$i]["nbpersonnes"]*0.4*$this->calculerDistance($agenceParent[$i],$lfTemp[$indexOldLF]);
                    if($lfTemp[$indexOldLF]["capaciteRestante"] == 60){
                        $lfTemp[$indexOldLF]["estOuvert"] = false;
                        $coutVoisin -= 3000;
                    }
                    $agenceTraitee = true;
                }else{
                    $choixRandom = rand(0,1);
                    if($choixRandom == 0){
                        $rand = rand(0,count($parent["listAgence"]) -1 );
                        $random = $parent["listAgence"][$rand]["indexOfLieuFormation"];
                    }else{
                        $random = rand(0,count($lfTemp)-1);
                    }
                }
            }
            if($coutVoisin<$prixMeilleurVoisin){
                $prixMeilleurVoisin = $coutVoisin;
                $voisin = array();
                $voisin["coutTotal"] = $coutVoisin;
                $voisin["listAgence"] = $agenceParent;
            }
        }
        return $voisin;
    }

    // Cette fonction génére une nouvelle liste de formation à partir d'une liste d'agences
    // La liste de LF aura pour lieu ouvert les lieux associés aux agences passées en paramètres
    function genererListLieuFormation($agences,$lieuxForma){
        for($i=0;$i<count($agences);$i++){
            $lieuxForma[$agences[$i]["indexOfLieuFormation"]]["estOuvert"] = true;
            $lieuxForma[$agences[$i]["indexOfLieuFormation"]]["capaciteRestante"] -= $agences[$i]["nbpersonnes"];
        }
        return $lieuxForma;
    }

    function algoTabou(){
        //On set un time out plus élevé pour les lancements d'un grand nombre d'itération
        set_time_limit(10000);
        $listLieuFormaTousFerme = $this->lieuFormation;
        $nbAgence = count($this->agences);
        //Initialisation de l'algorithme
        $ite = 0;
        $this->genererSolutionInit();
        $parent = $this->solution;
        $lfParent = $this->genererListLieuFormation($parent["listAgence"],$listLieuFormaTousFerme);
        // Pour chaque ité, on génére un voisinage et on en récupère le meilleur élément
        while($ite<$this->nbIte){
            $parent = $this->genererVoisinage($parent,$nbAgence,$lfParent);
            $lfParent = $this->genererListLieuFormation($parent["listAgence"],$listLieuFormaTousFerme);
            if($parent["coutTotal"]<$this->solution["coutTotal"]){
                $this->solution = $parent;
            }
            $ite++;
        }
        // On génère la liste de lieu de formation ouvert pour l'affichage sur le serveur
        $this->solution["listLieuFormationOuvert"] = $this->genererListLieuFormationOuvert($lfParent);
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
$prog->algoTabou();
