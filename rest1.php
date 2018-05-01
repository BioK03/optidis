<?php

header('Content-type: application/json');
$json = file_get_contents('php://input');
$json_decode = json_decode($json, true);

class Prog {
    var $agences;
    var $lieuFormation;
    var $nbIte;
    var $solution;
    var $solutionsIni;
    var $populationParent;

    function Prog(){}

    function parserDonnees($json)
    {
        $this->agences = $json["agences"];
        $this->lieuFormation = $json["lieuFormation"];
        $this->nbIte  = $json["nbIte"];
        $this->solutionsIni = array();
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
            $id = $listAgence[$i]["indexLieuFormation"];
            $sum += $listAgence[$i]["nbpersonnes"]*0.4*2*$this->calculerDistance($listAgence[$i],$this->lieuFormation[$id]);
        }
        return $sum;
    }

    function fermerLieuFormation($listLieuFormation){
        for($i=0 ; $i<count($listLieuFormation) ; $i++){
            $listLieuFormation[$i]["estOuvert"] = 'false';
            $listLieuFormation[$i]["capaciteRestante"] = 60;
        }
        return $listLieuFormation;
    }


    function algoGenetique(){
        $this->algoGenetiqueGeneration();
        $this->populationParent = array($this->solutionsIni);
        echo json_encode($this->populationParent);
        $this->creerRoueBiaise();
        //$this->afficherDonnees();
    }

    function algoGenetiqueGeneration(){
        //set_time_limit ( 60 );
        $solTemp;
        $ite = 0;
        $coutInteressant = 1000000;
        $coutTotal = 0;


        while($ite<$this->nbIte){

            for($i=0 ; $i<count($this->agences) ; $i++){
                $agenceTraitee = false;
                while(!$agenceTraitee){
                    $rand = rand(0, count($this->lieuFormation) - 1);
                    if($this->lieuFormation[$rand]["capaciteRestante"] >= $this->agences[$i]["nbpersonnes"]){
                        $this->agences[$i]["idLieuDeFormation"] = $this->lieuFormation[$rand]["id"];
                        $this->agences[$i]["indexLieuFormation"] = $rand;
                        $this->lieuFormation[$rand]["capaciteRestante"] -= $this->agences[$i]["nbpersonnes"];
                        $this->lieuFormation[$rand]["estOuvert"] = true;
                        $agenceTraitee = true;
                    }
                }
            }
            $coutTotal = $this->coutLieuFormationOuvert($this->lieuFormation) + $this->calculCoutTransport($this->agences);
            if($coutTotal < $coutInteressant)
            {
                $coutInteressant = $coutTotal;
                $this->solution["coutTotal"] = $coutTotal;
                $this->solution["listLieuFormationOuvert"] = $this->genererListLieuFormationOuvert($this->lieuFormation);
                $this->solution["listAgence"] = $this->agences;
            }
            $solTemp["coutTotal"] = $coutTotal;
            $solTemp["listLieuFormationOuvert"] = $this->genererListLieuFormationOuvert($this->lieuFormation);
            $solTemp["listAgence"] = $this->agences;
            array_push($this->solutionsIni,$solTemp);
            $ite++;
            $this->lieuFormation = $this->fermerLieuFormation($this->lieuFormation);
        }
        //echo json_encode($this->agences);


    }

    function creerRoueBiaise(){

        for($i=0 ; $i<count($this->populationParent) ; $i++){
            $this->populationParent[$i]["valBiaisee"] = $this->populationParent[$i]["coutTotal"]/$this->solution["coutTotal"];

        }
        usort($this->populationParent, 'sortIndividu');
        //echo json_encode($this->populationParent);
    }

    function sortIndividu($individu1, $individu2)
    {
	       return $individu1["valBiaisee"] < $individu2["valBiaisee"];
    }

    function selectionneParent(){
    /*    int val = // random de 0 à sommeDesFitness
 Chromosome result = null;

int min = 0;


for(Chromosome chr : chromosomeList) {

    int max = min + chr.getFitness();

    if( value >= min && value < max) {
        result = chr;
        break;
    }

    min += chr.getFitness();
}*/
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
