<?php

header('Content-type: application/json');
$json = file_get_contents('php://input');
$json_decode = json_decode($json, true);

class Lieu {
    var $id;
    var $nom;
    var $latitude;
    var $longitude;
    var $codePostal;

    function Lieu($id, $nom, $latitude, $longitude, $codePostal)
    {
        $this->id = $id;
        $this->nom = $nom;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->codePostal = $codePostal;
    }

    function getDistance(Lieu $l)
    {
        $lat1 = $this->latitude;
        $lat2 = $l->latitude;
        $long1 = $this->longitude;
        $long2 = $l->longitude;

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
}

class LieuFormation extends Lieu {
    var $capaciteInitiale;
    var $capaciteRestante;
    var $estOuvert;
    var $agencesAffectees;

    function LieuFormation($id, $nom, $latitude, $longitude, $codePostal)
    {
        $this->id = $id;
        $this->nom = $nom;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->codePostal = $codePostal;

        $this->capaciteInitiale = 60;
        $this->capaciteRestante = 60;
        $this->estOuvert = false;
        $this->agencesAffectees = array();
    }

    function addAgenceAffectee(Agence $a)
    {
        array_push($this->agencesAffectees, $a);
        $this->capaciteRestante -= $a->nbPersonnes;
    }

    function getNombreAgencesAffectees()
    {
        return count($this->agencesAffectees);
    }

    function isEmptyAgencesAffectees()
    {
        return empty($this->agencesAffectees);
    }

    function removeAgenceAffectee(Agence $a)
    {
        $newAgencesAffectees = array();
        for($i=0; $i<count($this->agencesAffectees); $i++)
        {
            if($this->agencesAffectees[$i]->id != $a->id)
            {
                array_push($newAgencesAffectees, $this->agencesAffectees[$i]);
            }
        }
        $this->agencesAffectees = $newAgencesAffectees;
        $this->capaciteRestante += $a->nbPersonnes;
    }

}

class Agence extends Lieu {
    var $listLieuFormation;
    var $nbPersonnes;
    var $lieuDeFormation;
    //var $distances;

    function Agence($id, $nom, $latitude, $longitude, $codePostal, $listLieuFormations, $nbPersonnes)
    {
        $this->id = $id;
        $this->nom = $nom;
        $this->latitude = $latitude;
        $this->longitude = $longitude;
        $this->codePostal = $codePostal;

        $this->listLieuFormations = $listLieuFormations;
        $this->nbPersonnes = $nbPersonnes;
        //$this->distances = array();
        $this->lieuDeFormation = null;
    }

    function lieuFormationOuvertLePlusProcheAvecCapacite($lfs)
    {
        $distance = 0;
        $result = null;
        for($i=0; $i<count($lfs); $i++)
        {
            if($lfs[$i]->estOuvert && $lfs[$i]->capaciteRestante > $this->nbPersonnes)
            {
                if($distance == 0 || $this->getDistanceLieuDeFormation($lfs[$i]) < $distance)
                {
                    $distance = $this->getDistanceLieuDeFormation($lfs[$i]);
                    $result = $lfs[$i];
                }
            }
        }
        return $result;
    }

    function lieuFormationOuvertLePlusProche($lfs)
    {
        $result = null;
        $distance = 0;
        for($i=0; $i<count($lfs); $i++)
        {
            if($lfs[$i]->estOuvert)
            {
                if($distance == 0 || $this->getDistanceLieuDeFormation($lfs[$i]) < $distance)
                {
                    $distance = $this->getDistanceLieuDeFormation($lfs[$i]);
                    $result = $lfs[$i];
                }
            }
        }
        return $result;
    }

    function lieuFormationLePlusProche($lfs)
    {
        $result = null;
        $distance = 0;
        for($i=0; $i<count($lfs); $i++)
        {
            if(!$lfs[$i]->estOuvert)
            {
                if($distance == 0 || $this->getDistanceLieuDeFormation($lfs[$i]) < $distance)
                {
                    $distance = $this->getDistanceLieuDeFormation($lfs[$i]);
                    $result = $lfs[$i];
                }
            }
        }
        return $result;
    }

    /*function initDistance($lfs)
    {
        for($i=0; $i<count($lfs); $i++)
        {
            $this->distances[$lfs[$i]->id] = $this->getDistance($lfs[$i]);
        }
    }*/

    function getDistanceLieuDeFormation(LieuFormation $lf)
    {
        //return $this->distances[$lf->id];
        return $this->getDistance($lf);
    }
}

class CalculUtils {

    function coutLieuFormationOuvert($lfs)
    {
        $nbLFOuvert = 0;
        for($i=0; $i<count($lfs); $i++)
        {
            if($lfs[$i]->estOuvert)
            {
                $nbLFOuvert++;
            }
        }
        return $nbLFOuvert * 3000;
    }

    function verifLieuFormationOuvert($lfs)
    {
        for($i=0; $i<count($lfs); $i++)
        {
            if($lfs[$i]->estOuvert && $lfs[$i]->capaciteRestante <0)
            {
                return false;
            }
        }
        return true;
    }

    function verifAgences($as)
    {
        for($i=0; $i<count($as); $i++)
        {
            if(is_null($as[$i]->lieuDeFormation))
            {
                return false;
            }
        }
        return true;
    }

    function coutTransport($as)
    {
        $sum = 0.0;
        for($i=0; $i<count($as); $i++)
        {
            $sum += $as[$i]->nbPersonnes*0.4*2*$as[$i]->getDistanceLieuDeFormation($as[$i]->lieuDeFormation);
        }
        return $sum;
    }

    function fermerLieuDeFormation($lfs)
    {
        for($i=0; $i<count($lfs); $i++)
        {
            $lfs[$i]->estOuvert = false;
        }
    }
}

class Prog {
    var $lieuFormationsOuvert;
    var $lieuFormations;
    var $agenceTraitees;
    var $agences;
    var $deepMax;

    var $solution;

    function Prog()
    {
        $this->deepMax = 1;
    }

    function algoHand()
    {
        $calc = new CalculUtils();

        /*for($i=0; $i<count($this->agences); $i++)
        {
            $this->agences[$i]->initDistance($this->lieuFormations);
        }*/
        $this->agenceTraitees = array();
        $this->lieuFormationsOuvert = array();

        for($i=0; $i<count($this->agences); $i++)
        {
            array_push($this->agenceTraitees, $this->agences[$i]);

            if(empty($this->lieuFormationsOuvert) || $this->coutDeplacement($this->agences[$i], $this->agences[$i]->lieuFormationOuvertLePlusProche($this->lieuFormationsOuvert)) > 3000+$this->coutDeplacement($this->agences[$i], $this->agences[$i]->lieuFormationLePlusProche($this->lieuFormations)))
            {
                $this->ouverture($this->agences[$i]->lieuFormationLePlusProche($this->lieuFormations));
            }
            $this->ajoutAgenceDansLieuFormation($this->agences[$i], $this->agences[$i]->lieuFormationOuvertLePlusProche($this->lieuFormationsOuvert), 0);
        }

        $this->solution = array();
        $this->solution["coutTotal"] = $calc->coutLieuFormationOuvert($this->lieuFormationsOuvert)+$calc->coutTransport($this->agences);;
        $this->solution["listLieuFormationOuvert"] = $this->encodeLfs($this->lieuFormationsOuvert);
        $this->solution["listAgence"] = $this->encodeAgences($this->agences);

        $this->afficherDonnees();
    }

    function encodeAgences($as)
    {
        $asArray = array();
        for($i=0; $i<count($as); $i++)
        {
            array_push($asArray,
                array(
                    "id"=>$as[$i]->id,
                    "nom"=>$as[$i]->nom,
                    "latitude"=>$as[$i]->latitude,
                    "longitude"=>$as[$i]->longitude,
                    "codepostal"=>$as[$i]->codePostal,
                    "nbpersonnes"=>$as[$i]->nbPersonnes,
                    "idLieuDeFormation"=>$as[$i]->lieuDeFormation->id
                )
            );
        }
        return $asArray;
    }

    function encodeLfs($lfs)
    {
        $lfsArray = array();
        for($i=0; $i<count($lfs); $i++)
        {
            array_push($lfsArray,
                array(
                    "id"=>$lfs[$i]->id,
                    "nom"=>$lfs[$i]->nom,
                    "codepostal"=>$lfs[$i]->codePostal,
                    "latitude"=>$lfs[$i]->latitude,
                    "longitude"=>$lfs[$i]->longitude,
                    "capaciteInitiale"=>$lfs[$i]->capaciteInitiale,
                    "capaciteRestante"=>$lfs[$i]->capaciteRestante,
                    "estOuvert"=>$lfs[$i]->estOuvert
                )
            );
        }
        return $lfsArray;
    }

    function parserDonnees($json)
    {
        $agencesArray = $json["agences"];
        $lieuFormationArray = $json["lieuFormation"];

        $this->agences = array();
        $this->lieuFormations = array();

        for($i=0; $i<count($lieuFormationArray); $i++)
        {
            array_push($this->lieuFormations, new LieuFormation($lieuFormationArray[$i]["id"], $lieuFormationArray[$i]["nom"], $lieuFormationArray[$i]["latitude"], $lieuFormationArray[$i]["longitude"], $lieuFormationArray[$i]["codepostal"]));
        }

        for($i=0; $i<count($agencesArray); $i++)
        {
            array_push($this->agences, new Agence($agencesArray[$i]["id"], $agencesArray[$i]["nom"], $agencesArray[$i]["latitude"], $agencesArray[$i]["longitude"], $agencesArray[$i]["codepostal"], $this->lieuFormations , $agencesArray[$i]["nbpersonnes"]));
        }
    }

    function ouverture(LieuFormation $lf)
    {
        $lf->estOuvert = true;
        array_push($this->lieuFormationsOuvert, $lf);

        for($i=0; $i<count($this->agenceTraitees); $i++)
        {
            if($this->coutDeplacement($this->agenceTraitees[$i], $this->agenceTraitees[$i]->lieuDeFormation) > $this->coutDeplacement($this->agenceTraitees[$i], $lf))
            {
                $this->retraitAgenceDansLieuFormation($this->agenceTraitees[$i], $this->agenceTraitees[$i]->lieuDeFormation);
                $this->ajoutAgenceDansLieuFormation($this->agenceTraitees[$i], $lf, 0);
            }
        }
    }

    function retraitAgenceDansLieuFormation(Agence $a, LieuFormation $lf)
    {
        $a->lieuDeFormation = null;
        $lf->removeAgenceAffectee($a);
        if($lf->isEmptyAgencesAffectees())
        {
            $lf->estOuvert = false;
            $lieuFormationsOuvertTemp = array();
            for($i=0; $i<count($this->lieuFormationsOuvert); $i++)
            {
                if($lf->id != $this->lieuFormationsOuvert[$i]->id)
                {
                    array_push($lieuFormationsOuvertTemp, $this->lieuFormationsOuvert[$i]);
                }
            }
            $this->lieuFormationsOuvert = $lieuFormationsOuvertTemp;
        }
    }

    function ajoutAgenceDansLieuFormation(Agence $a, LieuFormation $lf, $deep)
    {
        if(!$lf->estOuvert)
        {
            $this->ouverture($lf);
        }
        $a->lieuDeFormation = $lf;
        $lf->addAgenceAffectee($a);

        if($lf->capaciteRestante < 0)
        {
            $lieuFormationsOuvertTemp = array();
            for($i=0; $i<count($this->lieuFormationsOuvert); $i++)
            {
                if($lf->id != $this->lieuFormationsOuvert[$i]->id)
                {
                    array_push($lieuFormationsOuvertTemp, $this->lieuFormationsOuvert[$i]);
                }
            }
            $this->lieuFormationsOuvert = $lieuFormationsOuvertTemp;

            $lieuFormationsTemp = array();
            for($i=0; $i<count($this->lieuFormations); $i++)
            {
                if($lf->id != $this->lieuFormations[$i]->id)
                {
                    array_push($lieuFormationsTemp, $this->lieuFormations[$i]);
                }
            }
            $this->lieuFormations = $lieuFormationsTemp;

            $matrice = array();
            for($i=0; $i<count($lf->agencesAffectees); $i++)
            {
                $lfoprag = null;
                if($deep < $this->deepMax)
                {
                    $lfoprag = $lf->agencesAffectees[$i]->lieuFormationOuvertLePlusProche($this->lieuFormationsOuvert);/**/
                }
                else {
                    $lfoprag = $lf->agencesAffectees[$i]->lieuFormationOuvertLePlusProcheAvecCapacite($this->lieuFormationsOuvert);
                }
                $lfprag = $lf->agencesAffectees[$i]->lieuFormationLePlusProche($this->lieuFormations);
                if($this->coutDeplacement($lf->agencesAffectees[$i], $lfoprag) == 0 || $this->coutDeplacement($lf->agencesAffectees[$i], $lfoprag) > 3000 + $this->coutDeplacement($lf->agencesAffectees[$i], $lfprag))
                {
                    $matrice[$lf->agencesAffectees[$i]->id] = $this->coutDeplacement($lf->agencesAffectees[$i], $lfprag)+3000;
                }
                else {
                    $matrice[$lf->agencesAffectees[$i]->id] = $this->coutDeplacement($lf->agencesAffectees[$i], $lfoprag);
                }
            }

            $minAgence = array_keys($matrice)[0];
            $min = $matrice[$minAgence];

            while($lf->capaciteRestante<0)
            {
                for($i=0; $i<count(array_keys($matrice)); $i++)
                {
                    //$tempAgence = $this->getAgence(array_keys($matrice)[$i]);
                    if($matrice[array_keys($matrice)[$i]] > $min)
                    {
                        $minAgence = array_keys($matrice)[$i];
                        $min = $matrice[array_keys($matrice)[$i]];
                    }
                }

                $lfoprag = null;
                if($deep < $this->deepMax)
                {
                    $lfoprag = $this->getAgence($minAgence)->lieuFormationOuvertLePlusProche($this->lieuFormationsOuvert);
                }
                else {
                    $lfoprag = $this->getAgence($minAgence)->lieuFormationOuvertLePlusProcheAvecCapacite($this->lieuFormationsOuvert);
                }
                $lfprag = $this->getAgence($minAgence)->lieuFormationLePlusProche($this->lieuFormations);
                if($this->coutDeplacement($this->getAgence($minAgence), $lfoprag) == 0 || $this->coutDeplacement($this->getAgence($minAgence), $lfoprag) > 3000 + $this->coutDeplacement($this->getAgence($minAgence), $lfprag))
                {
                    $this->ouverture($lfprag);
                }
                $this->retraitAgenceDansLieuFormation($this->getAgence($minAgence), $lf);
                $this->ajoutAgenceDansLieuFormation($this->getAgence($minAgence), $lfprag, $deep+1);
            }

            array_push($this->lieuFormationsOuvert, $lf);
            array_push($this->lieuFormations, $lf);
        }
    }

    function getAgence($idAgence)
    {
        for($i=0; $i<count($this->agences); $i++)
        {
            if($this->agences[$i]->id == $idAgence)
            {
                return $this->agences[$i];
            }
        }
        return null;
    }

    function coutDeplacement(Agence $a, $lf)
    {
        if($lf==null)
        {
            return 0;
        }
        return $a->getDistanceLieuDeFormation($lf)*0.4*2*$a->nbPersonnes;
    }

    function afficherDonnees()
    {
        $json_encode = json_encode($this->solution);
        echo $json_encode;
    }
}

$prog = new Prog;
$prog->parserDonnees($json_decode);
$prog->algoHand();
