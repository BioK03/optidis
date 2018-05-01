<?php

header('Content-type: application/json');
$json = file_get_contents('php://input');
$json_decode = json_decode($json, true);

class Prog {
    var $agences;
    var $lieuFormation;
    var $solution;

    function Prog(){}

    function parserDonnees($json)
    {
        $this->agences = $json["agences"];
        $this->lieuFormation = $json["lieuFormation"];

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
            if($listAgence[$i]["idLieuDeFormation"] != "-1"){
                $id = $this->indexOfLieuFormation($listAgence[$i]["idLieuDeFormation"]);
                $sum += $listAgence[$i]["nbpersonnes"]*0.4*2*$this->calculerDistance($listAgence[$i],$this->lieuFormation[$id]);
            }
        }
        return $sum;
    }

    function calculCoutTransport2Points($agence, $lf)
    {
        return $agence["nbpersonnes"]*0.4*2*$this->calculerDistance($agence, $lf);
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
            $listLieuFormation[$i]["estOuvert"] = "false";
        }
        return $listLieuFormation;
    }

    function getIdLFOuvertplusproche($agence)
    {
        $distance = 100000000.0;
        $idLfFormationOuvert = -1;
        for($i=0 ; $i<count($this->lieuFormation) ; $i++)
        {
            if($this->lieuFormation[$i]["estOuvert"] == "true" && $this->lieuFormation[$i]["capaciteRestante"]>=$agence["nbpersonnes"]){
                $distanceTemp = $this->calculerDistance($agence, $this->lieuFormation[$i]);
                if($distanceTemp < $distance)
                {
                    $distance = $distanceTemp;
                    $idLfFormationOuvert = $this->lieuFormation[$i]["id"];
                }
            }
        }
        return $idLfFormationOuvert;
    }

    function getIdLFermePlusproche($agence)
    {
        $distance = 100000000.0;
        $idLfFormationFerme = -1;
        for($i=0 ; $i<count($this->lieuFormation) ; $i++)
        {
            if($this->lieuFormation[$i]["estOuvert"] == "false") {
                $distanceTemp = $this->calculerDistance($agence, $this->lieuFormation[$i]);
                if($distanceTemp < $distance)
                {
                    $distance = $distanceTemp;
                    $idLfFormationFerme = $this->lieuFormation[$i]["id"];
                }
            }
        }
        return $idLfFormationFerme;
    }

    function isOneOrMoreLfOuvert()
    {
        $res = false;
        for($i=0 ; $i<count($this->lieuFormation) ; $i++){
            if($this->lieuFormation[$i]["estOuvert"] == "true") {
                return true;
            }
        }
        return $res;
    }

    function algoSolutionSemiOpti(){
        set_time_limit (120);

        $json_encode = json_encode($this->lieuFormation);
        echo $json_encode;

        for($i=0 ; $i<count($this->agences) ; $i++){
            if($this->isOneOrMoreLfOuvert())
            {
                $idLfFormOuvert = $this->getIdLFOuvertplusproche($this->agences[$i]);
                $indexLfOuvert = $this->indexOfLieuFormation($idLfFormOuvert);
                $coutLfOuvert = $this->calculCoutTransport2Points($this->agences[$i], $this->lieuFormation[$indexLfOuvert]);
            }


            $idLfFormFerme = $this->getIdLFermePlusproche($this->agences[$i]);
            $indexLfFerme = $this->indexOfLieuFormation($idLfFormFerme);
            $coutLfFerme = 3000 + $this->calculCoutTransport2Points($this->agences[$i], $this->lieuFormation[$indexLfFerme]);

            if($this->isOneOrMoreLfOuvert())
            {
                if($coutLfOuvert < $coutLfFerme && $this->lieuFormation[$indexLfOuvert]["capaciteRestante"] >= $this->agences[$i]["nbpersonnes"])
                {
                    $this->lieuFormation[$indexLfOuvert]["capaciteRestante"] -= $this->agences[$i]["nbpersonnes"];
                    $this->agences[$i]["idLieuDeFormation"] = $this->lieuFormation[$indexLfOuvert]["id"];
                }
                else {
                    $this->lieuFormation[$indexLfFerme]["capaciteRestante"] -= $this->agences[$i]["nbpersonnes"];
                    $this->lieuFormation[$indexLfFerme]["estOuvert"] = "true";
                    $this->agences[$i]["idLieuDeFormation"] = $this->lieuFormation[$indexLfFerme]["id"];
                }
            }
            else {
                $this->lieuFormation[$indexLfFerme]["capaciteRestante"] -= $this->agences[$i]["nbpersonnes"];
                $this->lieuFormation[$indexLfFerme]["estOuvert"] = "true";
                $this->agences[$i]["idLieuDeFormation"] = $this->lieuFormation[$indexLfFerme]["id"];
            }

        }

        $coutTotal = $this->coutLieuFormationOuvert($this->lieuFormation) + $this->calculCoutTransport($this->agences);


        $this->solution["coutTotal"] = $coutTotal;
        $this->solution["listLieuFormationOuvert"] = $this->genererListLieuFormationOuvert($this->lieuFormation);
        $this->solution["listAgence"] = $this->agences;
        $this->lieuFormation = $this->fermerLieuFormation($this->lieuFormation);

        //echo json_encode($this->agences);

        //$this->afficherDonnees();
    }

    function afficherDonnees()
    {
        $json_encode = json_encode($this->solution);
        echo $json_encode;
    }

}

$prog = new Prog;
$prog->parserDonnees($json_decode);
$prog->algoSolutionSemiOpti();
