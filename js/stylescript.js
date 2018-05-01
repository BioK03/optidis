var popups = {
    showPopup: function($title, $content, $isBig, $rightButtonText, $rightButtonJS, $hide, $leftButtonText, $leftButtonJS) {
        $(".modal").slideUp();
        setTimeout(function(){
            if($hide) {
                $('#myModal').modal('hide');
            }
            $("#rightButton").remove();
            $("#leftButton").remove();
            $('.modal-dialog').removeClass("modal-lg");
            $(".modal-title").html($title);

            $(".modal-body").html($content);
            if($isBig){
                $('.modal-dialog').addClass("modal-lg");
            }
            if($rightButtonText != "")
            {
                $(".modal-footer").append("<button id='rightButton' type='button' class='btn btn-primary' onclick="+$rightButtonJS+">"+$rightButtonText+"</button>")
            }
            if($leftButtonText != "")
            {
                $(".modal-footer").prepend("<button id='leftButton' type='button' class='btn btn-primary' onclick="+$leftButtonJS+">"+$leftButtonText+"</button>")
            }
            if($(".modal").css("display") === "none")
            {
                $("#myModal").modal();
            }
            setTimeout(function(){
                $(".modal").slideDown();
            }, 400);
        }, 400);

    },
    hidePopup: function() {
        $('#myModal').modal('hide');
    }
};

$nbIterations = 1;
$nbGenerations = 1;

function showValue(newValue)
{
    $nbIterations = newValue;
	$("#range").html(newValue+" itération(s)");
}

function showValue2(newValue)
{
    $nbGenerations = newValue;
    $("#rangeGen").html(newValue+" génération(s)");
}

function insererDonnees($data)
{
    if($data == 1)
    {
        $("#ta_lf").val(defaultValues.lieuxFormation.content);
        $("#form_lf").val(defaultValues.lieuxFormation.parsing);
    }
    else if($data == 2)
    {
        $("#ta_ag").val(defaultValues.agences100.content);
        $("#form_ag").val(defaultValues.agences100.parsing);
    }
    else if($data == 3)
    {
        $("#ta_ag").val(defaultValues.agences300.content);
        $("#form_ag").val(defaultValues.agences300.parsing);
    }
    else if($data == 4)
    {
        $("#ta_ag").val(defaultValues.agences500.content);
        $("#form_ag").val(defaultValues.agences500.parsing);
    }
}

function validerDonnees($data)
{
    if($data == "Agence")
    {
        if($("#ta_ag").val()=="" || $("#form_ag").val()=="")
        {
            alert("Veuillez remplir au moins le contenu du fichier et la chaine de formatage");
            return;
        }
        if(($("#form_ag").val()).indexOf("id")>-1&&($("#form_ag").val()).indexOf("nom")>-1&&($("#form_ag").val()).indexOf("codepostal")>-1
            &&($("#form_ag").val()).indexOf("longitude")>-1&&($("#form_ag").val()).indexOf("latitude")>-1&&($("#form_ag").val()).indexOf("nbpersonnes")>-1)
        {
            var arrayPosition = $("#form_ag").val().replace(/"/g, "").split(";");
            var position = {
                id: arrayPosition.indexOf("id")!=-1?arrayPosition.indexOf("id"):function(){alert("Impossible de parser id dans la chaine de formatage");return null;},
                nom: arrayPosition.indexOf("nom")!=-1?arrayPosition.indexOf("nom"):function(){alert("Impossible de parser nom dans la chaine de formatage");return null;},
                codepostal: arrayPosition.indexOf("codepostal")!=-1?arrayPosition.indexOf("codepostal"):function(){alert("Impossible de parser codepostal dans la chaine de formatage");return null;},
                longitude: arrayPosition.indexOf("longitude")!=-1?arrayPosition.indexOf("longitude"):function(){alert("Impossible de parser longitude dans la chaine de formatage");return null;},
                latitude: arrayPosition.indexOf("latitude")!=-1?arrayPosition.indexOf("latitude"):function(){alert("Impossible de parser latitude dans la chaine de formatage");return null;},
                nbpersonnes: arrayPosition.indexOf("nbpersonnes")!=-1?arrayPosition.indexOf("nbpersonnes"):function(){alert("Impossible de parser nbpersonnes dans la chaine de formatage");return null;}
            };
            $content = $("#ta_ag").val().replace(/"/g, "").split("\n");
            if($("#cb_ag").is(':checked'))
            {
                $content.splice(0,1);
            }
            main.data.agences = [];
            map.clearAgencesLayer();
            map.clearPolylinesLayer();
            for($i=0; $i<$content.length; $i++)
            {
                $lineContent = $content[$i].split(";");
                var ag = {
                    id: $lineContent[position.id],
                    nom: $lineContent[position.nom],
                    codepostal: $lineContent[position.codepostal],
                    latitude: parseFloat($lineContent[position.latitude]),
                    longitude: parseFloat($lineContent[position.longitude]),
                    nbpersonnes: $lineContent[position.nbpersonnes],
                    idLieuDeFormation: -1
                };
                main.data.agences.push(ag);
            }
            map.addPointersList(main.data.agences, "agences");
        }
        else {
            alert("La chaine de formatage doit contenir id, nom, codepostal, longitude, latitude, nbpersonens");
        }
    }
    if($data == "Formation")
    {
        if($("#ta_lf").val()=="" || $("#form_lf").val()=="")
        {
            alert("Veuillez remplir au moins le contenu du fichier et la chaine de formatage");
            return;
        }
        if(($("#form_lf").val()).indexOf("id")>-1&&($("#form_lf").val()).indexOf("nom")>-1&&($("#form_lf").val()).indexOf("codepostal")>-1
            &&($("#form_lf").val()).indexOf("longitude")>-1&&($("#form_lf").val()).indexOf("latitude")>-1)
        {
            var arrayPosition = $("#form_lf").val().replace(/"/g, "").split(";");
            var position = {
                id: arrayPosition.indexOf("id")!=-1?arrayPosition.indexOf("id"):function(){alert("Impossible de parser id dans la chaine de formatage");return null;},
                nom: arrayPosition.indexOf("nom")!=-1?arrayPosition.indexOf("nom"):function(){alert("Impossible de parser nom dans la chaine de formatage");return null;},
                codepostal: arrayPosition.indexOf("codepostal")!=-1?arrayPosition.indexOf("codepostal"):function(){alert("Impossible de parser codepostal dans la chaine de formatage");return null;},
                longitude: arrayPosition.indexOf("longitude")!=-1?arrayPosition.indexOf("longitude"):function(){alert("Impossible de parser longitude dans la chaine de formatage");return null;},
                latitude: arrayPosition.indexOf("latitude")!=-1?arrayPosition.indexOf("latitude"):function(){alert("Impossible de parser latitude dans la chaine de formatage");return null;}
            };
            $content = $("#ta_lf").val().replace(/"/g, "").split("\n");
            if($("#cb_lf").is(':checked'))
            {
                $content.splice(0,1);
            }
            main.data.lieuFormation = [];
            map.clearFormationLayer();
            map.clearPolylinesLayer();
            for($i=0; $i<$content.length; $i++)
            {
                $lineContent = $content[$i].split(";");
                var lf = {
                    id: $lineContent[position.id],
                    nom: $lineContent[position.nom],
                    codepostal: $lineContent[position.codepostal],
                    latitude: parseFloat($lineContent[position.latitude]),
                    longitude: parseFloat($lineContent[position.longitude]),
                    capaciteInitiale: 60,
                    capaciteRestante: 60,
                    estOuvert: false
                };
                main.data.lieuFormation.push(lf);
            }
            map.addPointersList(main.data.lieuFormation, "formation");
        }
        else {
            alert("La chaine de formatage doit contenir id, nom, codepostal, longitude, latitude");
        }
    }
}


$isMenuToggled = false;
$(".menuOpti").click(function(){
    if($isMenuToggled)
    {
        $("#menu").css("white-space", "nowrap");
        $("#menu").animate({width: "0%"});
        $isMenuToggled = false;
    }
    else {
        $("#menu").animate({width: "23%"});
        setTimeout(function(){
            $("#menu").css("white-space", "normal");
        }, 400);

        $isMenuToggled = true;
    }
});

$("#map").click(function(){
    if($isMenuToggled)
    {
        $("#menu").css("white-space", "nowrap");
        $("#menu").animate({width: "0%"});
        $isMenuToggled = false;
    }
});

$("#assistant-init").click(function(){
    eval($popups.p0);
});

$("#logoProj").click(function(){
    eval($popups.pdesc);
});

$("#licenseLi").click(function(){
    eval($popups.pdesc);
});

$("#expAlgoGen").click(function(){
    eval($popups.pAlgoGen);
});

$("#expAlgoHM").click(function(){
    eval($popups.pAlgoHM);
});

$("#expAlgoTab").click(function(){
    eval($popups.pAlgoTab);
});

$("#maskClose").click(function(){
    map.clearFormationLayer();
    if($(this).attr("data-hide")=="hide")
    {
        $(this).attr("data-hide", "show");
        $(this).html("<i class='fa fa-graduation-cap'></i> Afficher tous les lieux de formation");
        var openLf = [];
        for($i=0; $i<main.data.lieuFormation.length; $i++)
        {
            if(main.data.lieuFormation[$i].estOuvert)
            {
                openLf.push(main.data.lieuFormation[$i]);
            }
        }
        map.addPointersList(openLf, "formation");
    }
    else {
        $(this).attr("data-hide", "hide");
        $(this).html("<i class='fa fa-graduation-cap'></i> Masquer les lieux de formation fermés");
        map.addPointersList(main.data.lieuFormation, "formation");
    }


});

$("#affAg").click(function(){
    eval($popups.pNewAddAgency);
});

$("#affLF").click(function(){
    eval($popups.pNewAddFormation);
});

$("#execAlgoGen").click(function(){
    eval($popups.pExecAlgoGen);
});

$("#execAlgoHand").click(function(){
    eval($popups.pExecAlgoHand);
});

$("#execAlgoTab").click(function(){
    eval($popups.pExecAlgoTab);
});

$("#reinitFormation").click(function(){
    main.fermerLieuxFormation();
});

$("#reinitMap").click(function(){
    map.clearAgencesLayer();
    map.clearFormationLayer();
    map.clearPolylinesLayer();
    main.data.agences = [];
    main.data.lieuFormation = [];
});

function executionAlgo($numeroAlgo)
{
    map.clearPolylinesLayer();
    main.fermerLieuxFormation();
    if($numeroAlgo == 1)
    {
        console.log("Lancement de l'algorithme génétique avec "+$nbIterations+" itérations et "+$nbGenerations+" génrations");
        main.algoGenetique($nbIterations, $nbGenerations);
        $("#algoGenSpinDesc").html("Envoi des données...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html("Traitement des données...");
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse");
        }, 500);
    }
    if($numeroAlgo == 2)
    {
        console.log("Lancement de l'algorithme hand made avec "+$nbIterations+" itérations");
        main.algoHand();
        $("#algoGenSpinDesc").html("Envoi des données...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html("Traitement des données...");
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse");
        }, 500);
    }
    if($numeroAlgo == 4)
    {
        console.log("Lancement de l'algorithme tabou avec "+$nbIterations+" itérations");
        main.algoTabou($nbIterations);
        $("#algoGenSpinDesc").html("Envoi des données...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html("Traitement des données...");
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse");
        }, 500);
    }
}

function callbackAlgo($numeroAlgo, $data)
{
    if($numeroAlgo == 1)
    {
        console.log("Algorithme génétique terminé");
        $("#algoGenSpinDesc").html("Affichage des données...");
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>Résultats</h1>"
                +"<br/>Cout total : "+Math.trunc($data["coutTotal"])+" €"
                +"<br/>Lieux de formation ouverts : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" agences traitées");
            for($i=0; $i<$data["listAgence"].length; $i++)
            {
                for($j=0; $j<main.data.lieuFormation.length; $j++)
                {
                    if($data["listAgence"][$i]["idLieuDeFormation"] == main.data.lieuFormation[$j]["id"])
                    {
                        main.data.lieuFormation[$j].estOuvert = true;
                        map.addPolyline($data["listAgence"][$i].latitude, $data["listAgence"][$i].longitude,
                            main.data.lieuFormation[$j].latitude, main.data.lieuFormation[$j].longitude);
                    }
                }
            }
            map.clearFormationLayer();
            map.addPointersList(main.data.lieuFormation, "formation");
        }, 1000);
    }
    if($numeroAlgo == 2)
    {
        console.log("Algorithme hand made terminé");
        $("#algoGenSpinDesc").html("Affichage des données...");
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>Résultats</h1>"
                +"<br/>Cout total : "+Math.trunc($data["coutTotal"])+" €"
                +"<br/>Lieux de formation ouverts : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" agences traitées");
            for($i=0; $i<$data["listAgence"].length; $i++)
            {
                for($j=0; $j<main.data.lieuFormation.length; $j++)
                {
                    if($data["listAgence"][$i]["idLieuDeFormation"] == main.data.lieuFormation[$j]["id"])
                    {
                        main.data.lieuFormation[$j].estOuvert = true;
                        map.addPolyline($data["listAgence"][$i].latitude, $data["listAgence"][$i].longitude,
                            main.data.lieuFormation[$j].latitude, main.data.lieuFormation[$j].longitude);
                    }
                }
            }
            map.clearFormationLayer();
            map.addPointersList(main.data.lieuFormation, "formation");
        }, 1000);
    }
    if($numeroAlgo == 3)
    {
        $("#algoGenSpin").removeClass().addClass("fa fa-exclamation");
        $("#algoGenSpinDesc").html("Le traitement coté serveur a duré plus de temps qu'autorisé (120 secondes) ou a pris plus de mémoire qu'allouée. Baissez le nombre d'itérations ou d'objets à calculer.");
    }
    if($numeroAlgo == 4)
    {
        console.log("Algorithme tabou terminé");
        $("#algoGenSpinDesc").html("Affichage des données...");
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>Résultats</h1>"
                +"<br/>Cout total : "+Math.trunc($data["coutTotal"])+" €"
                +"<br/>Lieux de formation ouverts : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" agences traitées");
            for($i=0; $i<$data["listAgence"].length; $i++)
            {
                for($j=0; $j<main.data.lieuFormation.length; $j++)
                {
                    if($data["listAgence"][$i]["idLieuDeFormation"] == main.data.lieuFormation[$j]["id"])
                    {
                        main.data.lieuFormation[$j].estOuvert = true;
                        map.addPolyline($data["listAgence"][$i].latitude, $data["listAgence"][$i].longitude,
                            main.data.lieuFormation[$j].latitude, main.data.lieuFormation[$j].longitude);
                    }
                }
            }
            map.clearFormationLayer();
            map.addPointersList(main.data.lieuFormation, "formation");
        }, 1000);
    }
}

$popups = {
    pdesc: "popups.showPopup(\"OPTIDIS powered by <a href='http://chbe.fr'><img class='imgLogoChbe' src='../img/logob.png'/></a>\", \"OPTIDIS est un site web vous permettant d'optimiser des "
        +"distances de trajet. Dans cette maquette, OPTIDIS permet d'optimiser les coûts de formation d\'employés venant de diverses agences.<br/>Projet créé par"
        +" Bertrand CHOUBERT, Damien CLARAS, et Thomas DATCU dans le cadre du projet 'Optimisation discrète', supporté par <a href='http://chbe.fr'>CHBE</a>.<br/><span class='text-center center  col-xs-12'>"
        +"<img class='h4em' src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/120px-HTML5_logo_and_wordmark.svg.png' title='HTML 5'/> <img class='h4em' src='http://www.astuces-webmaster.ch/tutos/css/css3.png' title='CSS 3'/> <img class='h4em' src='http://www.devictio.fr/wp-content/uploads/logo_javascript.png' title='JavaScript'/><br/><br/> <img class='h4em' src='http://www.alticreation.com/uploads/bootstrap.png' title='Bootstrap'/> <img class='h4em' src='http://mdbootstrap.com/wp-content/uploads/2015/12/mdb-white2.png' title='Material Design for Bootstrap'/><br/><br/><img class='h4em' src='http://www.weblisty.net/img/fontawesome.png' title='Font Awesome'/> <img class='h4em' src='http://ionicons.com/img/ionicons-logo.png' title='ionicons'/><br/><br/><img class='h4em' src='https://upload.wikimedia.org/wikipedia/en/9/9e/JQuery_logo.svg' title='jQuery'/><br/><br/><img class='h4em' src='https://lh3.googleusercontent.com/MOf9Kxxkj7GvyZlTZOnUzuYv0JAweEhlxJX6gslQvbvlhLK5_bSTK6duxY2xfbBsj43H=w300-rw' title='Google Maps API'/><br/><br/><img class='h4em' src='http://leafletjs.com/docs/images/logo.png' title='Leaflet'/> <img class='h4em' src='https://raw.githubusercontent.com/lvoogdt/Leaflet.awesome-markers/master/dist/images/markers-soft@2x.png' title='Leaflet awesome markers'/></span>"
        +"\", true, '', '', true, '', '');",
    p0: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", \""
        +"<p>Bienvenue dans l'assistant de configuration de OPTIDIS, plateforme d'optimisation de calcul de distance</p>"
        +"\", true, \"Suivant\", \"eval($popups.p1);\", false, \"\", \"\");",
    p1: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", \""
        +"<div class='row'>"
            +"<p class='btn btn-default col-xs-offset-1 col-xs-8 noPadding' onclick='eval($popups.pAddAgency);'><i class='fa fa-street-view'></i> Affecter les agences</p>"
            +"<p class='btn btn-default col-xs-1 col-xs-offset-1 noPadding' onclick='eval($popups.pDelAgency);'><i class='fa fa-times'></i></p>"
            +"<div class='col-xs-12'><hr class='sep'/></div>"
            +"<p class='btn btn-default col-xs-offset-1 col-xs-8 noPadding' onclick='eval($popups.pAddFormation);'><i class='fa fa-graduation-cap'></i> Affecter les lieux de formation</p>"
            +"<p class='btn btn-default col-xs-1 col-xs-offset-1 noPadding' onclick='eval($popups.pDelFormation);'><i class='fa fa-times'></i></p>"
        +"</div>\", true, \"\", \"\", false, \"\", \"\");",
    pAddAgency: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", "
        +"\"<p>Affectation des agences</p><br/><p class='btn btn-default col-xs-4' onclick='insererDonnees(2)'>Agences 100 par défaut</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(3)'>Agences 300 par défaut</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(4)'>Agences 500 par défaut</p><br/><br/><textarea id='ta_ag' class='textareacontent' placeholder='Collez ici la liste des agences'></textarea><input id='cb_ag' type='checkbox'/><label for='cb_ag'>Supprimer la première ligne ?</label><br/><p>Entrez la chaine de formatage (doit contenir id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_ag' type='text' placeholder='Formatage'/>\", true, \"Valider\",  \"validerDonnees('Agence');\", false, \"Retour\", \"eval($popups.p1)\"); ",
    pNewAddAgency: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", "
        +"\"<p>Affectation des agences</p><br/><p class='btn btn-default col-xs-4' onclick='insererDonnees(2)'>Agences 100 par défaut</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(3)'>Agences 300 par défaut</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(4)'>Agences 500 par défaut</p><br/><br/><textarea id='ta_ag' class='textareacontent' placeholder='Collez ici la liste des agences'></textarea><input id='cb_ag' type='checkbox'/><label for='cb_ag'>Supprimer la première ligne ?</label><br/><p>Entrez la chaine de formatage (doit contenir id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_ag' type='text' placeholder='Formatage'/>\", true, \"Valider\",  \"validerDonnees('Agence');\", false, \"\", \"\"); ",
    pDelAgency: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", "
        +"\"<p>Suppression des agences</p>\", true, \"\",  \"\", false, \"Retour\", \"eval($popups.p1)\");",
    pAddFormation: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", "
        +"\"<p>Affectation des lieux de formation</p><br/><p class='btn btn-default col-xs-12' onclick='insererDonnees(1)'>Insérer les lieux de formation par défaut</p><br/><br/><textarea id='ta_lf' class='textareacontent' placeholder='Collez ici la liste des lieux de formation'></textarea><input id='cb_lf' type='checkbox'/><label for='cb_lf'>Supprimer la première ligne ?</label><br/><p>Entrez la chaine de formatage (doit contenir id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_lf' type='text' placeholder='Formatage'/>\", true, \"Valider\",  \"validerDonnees('Formation')\", false, \"Retour\", \"eval($popups.p1)\");",
    pNewAddFormation: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", "
        +"\"<p>Affectation des lieux de formation</p><br/><p class='btn btn-default col-xs-12' onclick='insererDonnees(1)'>Insérer les lieux de formation par défaut</p><br/><br/><textarea id='ta_lf' class='textareacontent' placeholder='Collez ici la liste des lieux de formation'></textarea><input id='cb_lf' type='checkbox'/><label for='cb_lf'>Supprimer la première ligne ?</label><br/><p>Entrez la chaine de formatage (doit contenir id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_lf' type='text' placeholder='Formatage'/>\", true, \"Valider\",  \"validerDonnees('Formation')\", false, \"\", \"\");",
    pDelFormation: "popups.showPopup(\"<i class='fa fa-magic'></i> Assistant de configuration\", "
        +"\"<p>Suppression des lieux de formation</p>\", true, \"\",  \"\", false, \"Retour\", \"eval($popups.p1)\");",
    pExecAlgoGen: "popups.showPopup(\"Execution de l'algorithme génétique [WIP]\", "
        +"\"<input type='range' id='rangeAlgo' min='1' max='100' value='1' step='1' onchange='showValue(this.value)' /><span id='range'>1 itération(s)</span><input type='range' id='rangeGenAlgo' min='1' max='20' value='1' step='1' onchange='showValue2(this.value)' /><span id='rangeGen'>1 génération(s)</span><i id='algoGenSpin'></i><span id='algoGenSpinDesc'></span>\", true, \"Lancer l'exécution\", \"executionAlgo(1);\", false, \"\", \"\")",
    pExecAlgoHand: "popups.showPopup(\"Execution de l'algorithme Hand-made\", "
        +"\"<i id='algoGenSpin'></i><span id='algoGenSpinDesc'></span>\", true, \"Lancer l'exécution\", \"executionAlgo(2);\", false, \"\", \"\")",
    pExecAlgoTab: "popups.showPopup(\"Execution de l'algorithme Tabou\", "
        +"\"<input type='range' id='rangeAlgo' min='1' max='100000' value='1' step='100' onchange='showValue(this.value)' /><span id='range'>1 itération(s)</span><i id='algoGenSpin'></i><span id='algoGenSpinDesc'></span>\", true, \"Lancer l'exécution\", \"executionAlgo(4);\", false, \"\", \"\")",
    pAlgoGen: "popups.showPopup( \"Algorithme génétique [WIP]\", "
        +"\"Ce deuxième algorithme est basé sur une méta-heuristique génétique avec une génération aléatoire et un apprentissage.<br/><br/>"+
        "Chaque agence a une liste de lieux de formation initialisée avec tous les lieux de formation. La sélection aléatoire d’un lieu de formation pour une agence se fait grâce à cette liste (random entre 0 et list.size()-1). Lorsque l’algorithme apprend, le lieu de formation actuellement affecté à une agence est ajouté dans sa liste (cette liste va contenir des doublons) augmentant ainsi les chances que ce lieu de formation soit tiré au sort lors d’une prochaine génération.<br/><br/>"
        +"Une solution est la liste des lieux de formation ouverts, et les agences qui y sont affectées.<br/><br/>"+defaultValues.algos.gen+"\", true, \"\", \"\", false, \"\", \"\");",
    pAlgoHM: "popups.showPopup( \"Algorithme Hand-made\", "
        +"\"Ce premier algorithme à été construit sans se servir du cours. Le principe est le suivant :<br/>"
        +"<br/>"
        +"A chaque itération, on traite une agence. On regarde s’il est plus rentable d’ouvrir le lieu de formation le plus proche de cette agence ou d’affecter cette agence au lieu de formation déjà ouvert le plus proche.<br/><br/>"
        +"Lorsqu’on ouvre un nouveau lieu de formation, on regarde si les agences déjà traitées doivent être réaffectées (s’il est plus rentable pour ces agences d’être affectées à ce nouveau lieu de formation). <br/><br/>"
        +"Tout au long de ce processus, on gère bien sûr la problématique du nombre de places limité. Ainsi, lorsqu’on affecte une agence à un lieu de formation,  si celui-ci est complet on regarde quelle(s) agence(s) devrai(en)t être réaffectée(s), et si elle(s) doi(ven)t l’être dans le lieu de formation déjà ouvert le plus proche ou dans un nouveau lieu de formation. <br/><br/>"+defaultValues.algos.handmade+"\", true, \"\", \"\", false, \"\", \"\");",
    pAlgoTab: "popups.showPopup( \"Algorithme Tabou\", "
        +"\"La conception de cet algorithme est tirée de la métaheuristique “TABOU” vue en cours qui a cependant été réadaptée afin de prendre en compte les contraintes liées à cette métaheuristique, soient les problèmes de stockage (génération du voisinage) et de calcul.<br/><br/>"
        +"insi, contrairement à ce qui a été vu en cours, on ne génère pas l’ensemble de notre voisinage, celui-ci occuperait alors une place mémoire beaucoup trop importante ce qui entraînerait une erreur dans l’exécution de notre algorithme ( le voisinage ayant pour taille nbAgences * nbLieuxFormation ). Nous ne traitons donc uniquement qu’un nombre de voisins égal au nombre d’agences fournies en paramètre de l’algorithme.<br/>"
        +"Dans le but de faire converger plus rapidement notre algorithme, nous avons également décidé de modifier la façon dont le lieu de formation peut être associé à une agence : nous avons 50% de chance de choisir un lieu de formation déjà ouvert, ou sinon de choisir n’importe lequel des lieux de formations fournis à notre algorithme.<br/>"
        +"Nous avons également fait le choix de ne pas utiliser de liste Tabou. En effet, la fitness à optimiser étant le coût total de transport, nous nous sommes rendus compte qu’il était peu probable de retomber sur un résultat déjà rencontré et donc de faire boucler notre algorithme. De plus, ceci permet d’améliorer notre vitesse de traitement.<br/><img class='w33' src='img/100.png'/><img class='w33' src='img/300.png'/><img class='w33' src='img/500.png'/><br/>"+defaultValues.algos.tabou+"\", true, \"\", \"\", false, \"\", \"\");"
}




/*


*/
