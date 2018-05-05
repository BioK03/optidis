<?php

require "params.inc.php";

function isKeyValid($keyToCheck) {

    require "params.inc.php";
    return in_array($keyToCheck, $keys);
}

function isLimitReached($nbAgences, $nbLieuxFormation, $nbIterations) {
    if($nbAgences > 10 || $nbLieuxFormation > 50 || $nbIterations > 15) {
        return true;
    }
    return false;
}