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
    },
    showPopupFromObject: function(name) {
        if($popups.hasOwnProperty(name)) {
            var chosenPopup = $popups[name];

            var title = chosenPopup.title[getSelectedLanguage()];
            var content = chosenPopup.body[getSelectedLanguage()];

            popups.showPopup(title, content, chosenPopup.isBig, chosenPopup.rightButtonText, 
                chosenPopup.rightButtonJS, chosenPopup.hide, chosenPopup.leftButtonText, chosenPopup.leftButtonJS);
        } else {
            console.error("Aucune popup de ce nom : " + name);
        }
    }
};

$nbIterations = 1;
$nbGenerations = 1;

function showValue(newValue)
{
    $nbIterations = newValue;
	$("#range").html(newValue + " " + getTraduction("iterations"));
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

$("#logoProj").click(function(){
    popups.showPopupFromObject("pdesc");
});

$("#licenseLi").click(function(){
    popups.showPopupFromObject("pdesc");
});

$("#expAlgoHM").click(function(){
    popups.showPopupFromObject("pAlgoHM");
});

$("#expAlgoTab").click(function(){
    popups.showPopupFromObject("pAlgoTab");
});

$("#maskClose").click(function(){
    toogleMaskClosed();
});

$("#affAg").click(function(){
    popups.showPopupFromObject("pNewAddAgency");
});

$("#affLF").click(function(){
    popups.showPopupFromObject("pNewAddFormation");
});

$("#execAlgoHand").click(function(){
    popups.showPopupFromObject("pExecAlgoHand");
});

$("#execAlgoTab").click(function(){
    popups.showPopupFromObject("pExecAlgoTab");
});

$("#reinitMap").click(function(){
    map.clearAgencesLayer();
    map.clearFormationLayer();
    map.clearPolylinesLayer();
    main.data.agences = [];
    main.data.lieuFormation = [];
});

$("#inputKey").change(function(e) {
    storeKey(e.currentTarget.value);
});

$(".languageSelector .dropdown-item").click(function(e) {
    changerLangue(e.currentTarget.getAttribute("data-lang"));
});

$("#demoMenu").click(function() {
    popups.showPopupFromObject("pdemo1");
});

function toogleMaskClosed() {
    map.clearFormationLayer();
    if($("#maskClose").attr("data-hide")=="hide")
    {
        $("#maskClose").attr("data-hide", "show");
        $("#maskClose").html("<i class='fa fa-graduation-cap'></i> <span class='textContent'>" + getTraduction("btnMaskClosedOff") + "</span>");
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
        $("#maskClose").attr("data-hide", "hide");
        $("#maskClose").html("<i class='fa fa-graduation-cap'></i> <span class='textContent'>" + getTraduction("btnMaskClosedOn") + "</span>");
        map.addPointersList(main.data.lieuFormation, "formation");
    }
}

function executionAlgo($numeroAlgo)
{
    map.clearPolylinesLayer();
    main.fermerLieuxFormation();

    if($numeroAlgo == 2)
    {
        console.log("Lancement de l'algorithme hand made avec "+$nbIterations+" itérations");
        main.algoHand();
        $("#algoGenSpinDesc").html("Envoi des données...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html(getTraduction("dataProcessiong"));
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse fa-fw");
        }, 500);
    }
    if($numeroAlgo == 4)
    {
        console.log("Lancement de l'algorithme tabou avec "+$nbIterations+" itérations");
        main.algoTabou($nbIterations);
        $("#algoGenSpinDesc").html("Envoi des données...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html(getTraduction("dataProcessiong"));
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse fa-fw");
        }, 500);
    }
}

function callbackAlgo($numeroAlgo, $data)
{
    if($numeroAlgo == 1)
    {
        console.log("Erreur de clé");
        popups.showPopupFromObject("pKeyError");
    }
    if($numeroAlgo == 2)
    {
        console.log("Algorithme hand made terminé");
        $("#algoGenSpinDesc").html(getTraduction("affichageDonnees"));
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>"+getTraduction("results")+"</h1><br/>"
                +getTraduction("coutTotal")+" : "+Math.trunc($data["coutTotal"])+" €<br/>"
                +getTraduction("lieuxFormationOuverts")+" : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" "+getTraduction("agencesTraitees"));
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
        $("#algoGenSpinDesc").html(getTraduction("tooMuchRessource"));
    }
    if($numeroAlgo == 4)
    {
        console.log("Algorithme tabou terminé");
        $("#algoGenSpinDesc").html(getTraduction("affichageDonnees"));
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>"+getTraduction("results")+"</h1><br/>"
                +getTraduction("coutTotal")+" : "+Math.trunc($data["coutTotal"])+" €<br/>"
                +getTraduction("lieuxFormationOuverts")+" : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" "+getTraduction("agencesTraitees"));
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

function insertDemoData(triggerDemo2) {

    var arrayPosition = defaultValues.agencesDemo.parsing.replace(/"/g, "").split(";");
    var position = {
        id: arrayPosition.indexOf("id")!=-1?arrayPosition.indexOf("id"):function(){alert("Impossible de parser id dans la chaine de formatage");return null;},
        nom: arrayPosition.indexOf("nom")!=-1?arrayPosition.indexOf("nom"):function(){alert("Impossible de parser nom dans la chaine de formatage");return null;},
        codepostal: arrayPosition.indexOf("codepostal")!=-1?arrayPosition.indexOf("codepostal"):function(){alert("Impossible de parser codepostal dans la chaine de formatage");return null;},
        longitude: arrayPosition.indexOf("longitude")!=-1?arrayPosition.indexOf("longitude"):function(){alert("Impossible de parser longitude dans la chaine de formatage");return null;},
        latitude: arrayPosition.indexOf("latitude")!=-1?arrayPosition.indexOf("latitude"):function(){alert("Impossible de parser latitude dans la chaine de formatage");return null;},
        nbpersonnes: arrayPosition.indexOf("nbpersonnes")!=-1?arrayPosition.indexOf("nbpersonnes"):function(){alert("Impossible de parser nbpersonnes dans la chaine de formatage");return null;}
    };
    $content = defaultValues.agencesDemo.content.replace(/"/g, "").split("\n");

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



    var arrayPosition = defaultValues.lieuxFormationDemo.parsing.replace(/"/g, "").split(";");
    var position = {
        id: arrayPosition.indexOf("id")!=-1?arrayPosition.indexOf("id"):function(){alert("Impossible de parser id dans la chaine de formatage");return null;},
        nom: arrayPosition.indexOf("nom")!=-1?arrayPosition.indexOf("nom"):function(){alert("Impossible de parser nom dans la chaine de formatage");return null;},
        codepostal: arrayPosition.indexOf("codepostal")!=-1?arrayPosition.indexOf("codepostal"):function(){alert("Impossible de parser codepostal dans la chaine de formatage");return null;},
        longitude: arrayPosition.indexOf("longitude")!=-1?arrayPosition.indexOf("longitude"):function(){alert("Impossible de parser longitude dans la chaine de formatage");return null;},
        latitude: arrayPosition.indexOf("latitude")!=-1?arrayPosition.indexOf("latitude"):function(){alert("Impossible de parser latitude dans la chaine de formatage");return null;}
    };
    $content = defaultValues.lieuxFormationDemo.content.replace(/"/g, "").split("\n");

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

    popups.showPopupFromObject('pdemo2');
}

$popups = {
    pdesc: {
        title: {
            fr: "OPTIDIS",
            en: "OPTIDIS"
        },
        body: {
            fr: `<div>
                OPTIDIS est un site web vous permettant d'optimiser des distances de trajet.
                Dans cette maquette, OPTIDIS permet d'optimiser les coûts de formation d\'employés venant de diverses agences.<br/>
                Projet créé par Bertrand CHOUBERT, Damien CLARAS, et Thomas DATCU dans le cadre du projet 'Optimisation discrète'.<br/>
                <span class='imgContainer'>
                    <img class='h4em' src='img/tech/html.png' title='HTML 5'/>
                    <img class='h4em' src='img/tech/css.png' title='CSS 3'/>
                    <img class='h4em' src='img/tech/javascript.png' title='JavaScript'/><br/><br/>
                    <img class='h4em' src='img/tech/bootstrap.png' title='Bootstrap'/>"
                    <img class='h4em' src='img/tech/mdbootstrap.png' title='Material Design for Bootstrap'/><br/><br/>
                    <img class='h4em' src='img/tech/fontawesome.png' title='Font Awesome'/>
                    <img class='h4em' src='img/tech/ionicons.png' title='ionicons'/><br/><br/>
                    <img class='h4em' src='img/tech/jquery.png' title='jQuery'/><br/><br/>
                    <img class='h4em' src='img/tech/google-maps.png' title='Google Maps API'/><br/><br/>
                    <img class='h4em' src='img/tech/leaflet.png' title='Leaflet'/>
                    <img class='h4em' src='img/tech/leaflet-awesome-markers.png' title='Leaflet awesome markers'/>
                </span>
            </div>`,
            en: `<div>
                OPTIDIS is a distance-optimisation website.
                In this showcase, OPTIDIS permits to optimise training cost of employees from several agencies.<br/>
                This project was designed and developed by Bertrand CHOUBERT, Damien CLARAS, and Thomas DATCU.<br/>
                <span class='imgContainer'>
                    <img class='h4em' src='img/tech/html.png' title='HTML 5'/>
                    <img class='h4em' src='img/tech/css.png' title='CSS 3'/>
                    <img class='h4em' src='img/tech/javascript.png' title='JavaScript'/><br/><br/>
                    <img class='h4em' src='img/tech/bootstrap.png' title='Bootstrap'/>"
                    <img class='h4em' src='img/tech/mdbootstrap.png' title='Material Design for Bootstrap'/><br/><br/>
                    <img class='h4em' src='img/tech/fontawesome.png' title='Font Awesome'/>
                    <img class='h4em' src='img/tech/ionicons.png' title='ionicons'/><br/><br/>
                    <img class='h4em' src='img/tech/jquery.png' title='jQuery'/><br/><br/>
                    <img class='h4em' src='img/tech/google-maps.png' title='Google Maps API'/><br/><br/>
                    <img class='h4em' src='img/tech/leaflet.png' title='Leaflet'/>
                    <img class='h4em' src='img/tech/leaflet-awesome-markers.png' title='Leaflet awesome markers'/>
                </span>
            </div>`
        },
        isBig: true,
        rightButtonText: "",
        rightButtonJS: "",
        hide: true,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pNewAddAgency: {
        title: {
            fr: "<i class='fa fa-magic'></i> Assistant de configuration",
            en: "<i class='fa fa-magic'></i> Configuration assistant"
        },
        body: {
            fr: `<p>Affectation des agences</p><br/>
                <p class="red-text"><i class="fa fa-exclamation-triangle"></i> Le quota de la version limitée est de 10 agences !</p><br/>
                <p class='btn btn-default col-xs-4' onclick='insererDonnees(2)'>Agences 100 par défaut</p>
                <p class='btn btn-default col-xs-4' onclick='insererDonnees(3)'>Agences 300 par défaut</p>
                <p class='btn btn-default col-xs-4' onclick='insererDonnees(4)'>Agences 500 par défaut</p><br/><br/>
                <textarea id='ta_ag' class='textareacontent' placeholder='Collez ici la liste des agences' rows='6'></textarea>
                <input id='cb_ag' type='checkbox'/><label for='cb_ag'>Supprimer la première ligne ?</label><br/>
                <p>Entrez la chaine de formatage (doit contenir id, nom, codepostal, longitude, latitude, nbpersonnes): <br/>
                <input id='form_ag' type='text' placeholder='Formatage'/>`,
            en: `<p>Agencies insertion</p><br/>
                <p class="red-text"><i class="fa fa-exclamation-triangle"></i> The quota for the limited version is 10 agencies !</p><br/>
                <p class='btn btn-default col-xs-4' onclick='insererDonnees(2)'>100 default agencies</p>
                <p class='btn btn-default col-xs-4' onclick='insererDonnees(3)'>300 default agencies</p>
                <p class='btn btn-default col-xs-4' onclick='insererDonnees(4)'>500 default agencies</p><br/><br/>
                <textarea id='ta_ag' class='textareacontent' placeholder='Paste here the list of agencies' rows='6'></textarea>
                <input id='cb_ag' type='checkbox'/><label for='cb_ag'>Delete the first line?</label><br/>
                <p>Format string (must contain id, nom, codepostal, longitude, latitude, nbpersonnes): <br/>
                <input id='form_ag' type='text' placeholder='Format string'/>`
        },
        isBig: true,
        rightButtonText: "<i class='fa fa-check'></i>",
        rightButtonJS: "validerDonnees('Agence')",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pNewAddFormation: {
        title: {
            fr: "<i class='fa fa-magic'></i> Assistant de configuration",
            en: "<i class='fa fa-magic'></i> Configuration assistant"
        },
        body: {
            fr: `<p>Affectation des lieux de formation</p><br/>
                <p class="red-text"><i class="fa fa-exclamation-triangle"></i> Le quota de la version limitée est de 50 lieux de formation !</p><br/>
                <p class='btn btn-default col-xs-12' onclick='insererDonnees(1)'>Insérer les lieux de formation par défaut</p><br/><br/>
                <textarea id='ta_lf' class='textareacontent' placeholder='Collez ici la liste des lieux de formation' rows='6'></textarea>
                <input id='cb_lf' type='checkbox'/><label for='cb_lf'>Supprimer la première ligne ?</label><br/>
                <p>Entrez la chaine de formatage (doit contenir id, nom, codepostal, longitude, latitude, nbpersonnes): <br/>
                <input id='form_lf' type='text' placeholder='Formatage'/>`,
            en: `<p>Training centers insertion</p><br/>
                <p class="red-text"><i class="fa fa-exclamation-triangle"></i> The quota for the limited version is 50 training centers!</p><br/>
                <p class='btn btn-default col-xs-12' onclick='insererDonnees(1)'>Default training centers</p><br/><br/>
                <textarea id='ta_lf' class='textareacontent' placeholder='Paste here the list of training centers' rows='6'></textarea>
                <input id='cb_lf' type='checkbox'/><label for='cb_lf'>Delete the first line?</label><br/>
                <p>Format string (must contain id, nom, codepostal, longitude, latitude, nbpersonnes): <br/>
                <input id='form_lf' type='text' placeholder='Format string'/>`
        },
        isBig: true,
        rightButtonText: "<i class='fa fa-check'></i>",
        rightButtonJS: "validerDonnees('Formation')",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pExecAlgoHand: {
        title: {
            fr: "Execution de l'algorithme Hand-made",
            en: "Hand made algorithm execution"
        },
        body: {
            fr: `<i id='algoGenSpin'></i><span id='algoGenSpinDesc'>Cliquez sur <i class='fa fa-arrow-right'></i> pour continuer</span>`,
            en: `<i id='algoGenSpin'></i><span id='algoGenSpinDesc'>Press <i class='fa fa-arrow-right'></i> to continue</span>`
        },
        isBig: true,
        rightButtonText: "<i class='fa fa-arrow-right'></i>",
        rightButtonJS: "executionAlgo(2)",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pExecAlgoTab: {
        title: {
            fr: "Execution de l'algorithme Tabou",
            en: "Tabou algorithm execution"
        },
        body: {
            fr: `<p class="red-text"><i class="fa fa-exclamation-triangle"></i> Le quota de la version limitée est de 15 itérations !</p><br/>
                <input type='range' id='rangeAlgo' min='1' max='1000' value='1' step='10' onchange='showValue(this.value)' oninput='showValue(this.value)' />
                <span id='range'>1 itération(s)</span>
                <i id='algoGenSpin'></i>
                <span id='algoGenSpinDesc'>Cliquez sur <i class='fa fa-arrow-right'></i> pour continuer</span>`,
            en: `<p class="red-text"><i class="fa fa-exclamation-triangle"></i> The quota for the limited version is 15 iterations!</p><br/>
                <input type='range' id='rangeAlgo' min='1' max='200' value='1' step='5' onchange='showValue(this.value)' oninput='showValue(this.value)' />
                <span id='range'>1 iteration(s)</span>
                <i id='algoGenSpin'></i>
                <span id='algoGenSpinDesc'>Press <i class='fa fa-arrow-right'></i> to continue</span>`
        },
        isBig: true,
        rightButtonText: "<i class='fa fa-arrow-right'></i>",
        rightButtonJS: "executionAlgo(4)",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pAlgoHM: {
        title: {
            fr: "Algorithme Hand-made",
            en: "Hand made algorithm"
        },
        body: {
            fr: `Ce premier algorithme à été construit sans se servir du cours. Le principe est le suivant :<br/><br/>
                A chaque itération, on traite une agence.
                On regarde s’il est plus rentable d’ouvrir le lieu de formation le plus proche de cette agence ou d’affecter 
                cette agence au lieu de formation déjà ouvert le plus proche.<br/><br/>
                Lorsqu’on ouvre un nouveau lieu de formation, on regarde si les agences déjà traitées doivent être réaffectées
                (s’il est plus rentable pour ces agences d’être affectées à ce nouveau lieu de formation). <br/><br/>
                Tout au long de ce processus, on gère bien sûr la problématique du nombre de places limité.
                Ainsi, lorsqu’on affecte une agence à un lieu de formation, si celui-ci est complet on regarde quelle(s) agence(s) devrai(en)t être réaffectée(s), 
                et si elle(s) doi(ven)t l’être dans le lieu de formation déjà ouvert le plus proche ou dans un nouveau lieu de formation. <br/><br/>`
                + defaultValues.algos.handmade,
            en: `his first algorithm was build starting from scratch. Its principle :<br/><br/>
                At each iteration, we select an agency to process.
                We choose whether its more profitable to open the closest training center of this agency, or to affect all people 
                from this agency at the closest open training center.<br/><br/>
                When we open a new training center, we look if agencies already processed has to be reassign
                (if it's more profitable for these agencies to be affected at this newly opened training center).<br/><br/>
                All along this process, we manage of course the limited number of available seats of each training center.
                So, when we affect an agency at a training center, if this become full, we look after what agencies must be reassign,
                and if they do in the closest opened training center or in another one.<br/><br/>`
                + defaultValues.algos.handmade,
        },
        isBig: true,
        rightButtonText: "",
        rightButtonJS: "",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pAlgoTab: {
        title: {
            fr: "Algorithme Tabou",
            en: "Tabou algorithm"
        },
        body: {
            fr: `La conception de cet algorithme est tirée de la métaheuristique “TABOU” vue en cours qui a cependant été réadaptée afin 
                de prendre en compte les contraintes liées à cette métaheuristique, soient les problèmes de stockage (génération du voisinage) et de calcul.<br/><br/>
                Ainsi, contrairement à ce qui a été vu en cours, on ne génère pas l’ensemble de notre voisinage, 
                celui-ci occuperait alors une place mémoire beaucoup trop importante ce qui entraînerait une erreur dans 
                l’exécution de notre algorithme ( le voisinage ayant pour taille nbAgences * nbLieuxFormation ). 
                Nous ne traitons donc uniquement qu’un nombre de voisins égal au nombre d’agences fournies en paramètre de l’algorithme.<br/>
                Dans le but de faire converger plus rapidement notre algorithme, 
                nous avons également décidé de modifier la façon dont le lieu de formation peut être associé à une agence : 
                nous avons 50% de chance de choisir un lieu de formation déjà ouvert, ou sinon de choisir n’importe lequel des lieux de formations fournis à notre algorithme.<br/>
                Nous avons également fait le choix de ne pas utiliser de liste Tabou. 
                En effet, la fitness à optimiser étant le coût total de transport, nous nous sommes rendus compte qu’il était peu probable de 
                retomber sur un résultat déjà rencontré et donc de faire boucler notre algorithme. De plus, ceci permet d’améliorer notre vitesse de traitement.<br/>
                <img class='w33' src='img/100.png'/><img class='w33' src='img/300.png'/><img class='w33' src='img/500.png'/><br/>`
                + defaultValues.algos.tabou,
            en: `The design of this algorithm comes from the “TABOU” matheuristic seen in the course, but it had to be adapted to take into account the counstraint linked to this 
                matheuristicvue, like the storage problems (neighborhood generation) and calculation ones.<br/><br/>
                So, we don't generate all the neighborhood, it would have taken too much space (neightborhood = nbAgencies * nbTrainingCenters).
                Therefore, we process only a limited number of neighbors that is equal to a parameter of this algorithm.<br/>
                In order to let our algorithm to converge fastly,
                we had also decided to modify the link between a training center and an agency :
                we have 50% of change to choose an already opened training center, otherwise we choose a random training center.<br/>
                We choose also to not use the "Tabou list". Indeed, the fitness to optimize is the total cost of transportation, we realized that it was unlikely to
                fall back on a result that has been already met in the past (and then to loop infintely - at least the number of iterations).
                Furthermore, this decreases the process time.`
                + defaultValues.algos.tabou
        },
        isBig: true,
        rightButtonText: "",
        rightButtonJS: "",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pKeyError: {
        title: {
            fr: "Limite atteinte et clé invalide !",
            en: "Limit reached and invalid key!"
        },
        body: {
            fr: "<p>La limite de 10 agences, 50 lieux de formation et 15 itérations est atteinte. Merci de rentrer une clé valide via le menu et réessayer.</p>",
            en: "<p>The limit of 10 agencies, 50 training centers and 15 iterations has been reached. Please enter a valid key via the menu and retry.</p>"
        },
        isBig: false,
        rightButtonText: "",
        rightButtonJS: "",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pAlgoTab: {
        title: {
            fr: "Algorithme Tabou",
            en: "Tabou algorithm"
        },
        body: {
            fr: `La conception de cet algorithme est tirée de la métaheuristique “TABOU” vue en cours qui a cependant été réadaptée afin 
                de prendre en compte les contraintes liées à cette métaheuristique, soient les problèmes de stockage (génération du voisinage) et de calcul.<br/><br/>
                Ainsi, contrairement à ce qui a été vu en cours, on ne génère pas l’ensemble de notre voisinage, 
                celui-ci occuperait alors une place mémoire beaucoup trop importante ce qui entraînerait une erreur dans 
                l’exécution de notre algorithme ( le voisinage ayant pour taille nbAgences * nbLieuxFormation ). 
                Nous ne traitons donc uniquement qu’un nombre de voisins égal au nombre d’agences fournies en paramètre de l’algorithme.<br/>
                Dans le but de faire converger plus rapidement notre algorithme, 
                nous avons également décidé de modifier la façon dont le lieu de formation peut être associé à une agence : 
                nous avons 50% de chance de choisir un lieu de formation déjà ouvert, ou sinon de choisir n’importe lequel des lieux de formations fournis à notre algorithme.<br/>
                Nous avons également fait le choix de ne pas utiliser de liste Tabou. 
                En effet, la fitness à optimiser étant le coût total de transport, nous nous sommes rendus compte qu’il était peu probable de 
                retomber sur un résultat déjà rencontré et donc de faire boucler notre algorithme. De plus, ceci permet d’améliorer notre vitesse de traitement.<br/>
                <img class='w33' src='img/100.png'/><img class='w33' src='img/300.png'/><img class='w33' src='img/500.png'/><br/>`
                + defaultValues.algos.tabou,
            en: `The design of this algorithm comes from the “TABOU” matheuristic seen in the course, but it had to be adapted to take into account the counstraint linked to this 
                matheuristicvue, like the storage problems (neighborhood generation) and calculation ones.<br/><br/>
                So, we don't generate all the neighborhood, it would have taken too much space (neightborhood = nbAgencies * nbTrainingCenters).
                Therefore, we process only a limited number of neighbors that is equal to a parameter of this algorithm.<br/>
                In order to let our algorithm to converge fastly,
                we had also decided to modify the link between a training center and an agency :
                we have 50% of change to choose an already opened training center, otherwise we choose a random training center.<br/>
                We choose also to not use the "Tabou list". Indeed, the fitness to optimize is the total cost of transportation, we realized that it was unlikely to
                fall back on a result that has been already met in the past (and then to loop infintely - at least the number of iterations).
                Furthermore, this decreases the process time.`
                + defaultValues.algos.tabou
        },
        isBig: true,
        rightButtonText: "",
        rightButtonJS: "",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pdemo1: {
        title: {
            fr: "Qu'est-ce qu'Optidis ?",
            en: "What is Optidis?"
        },
        body: {
            fr: `<p>Optidis est un projet d'optimisation de coût pour la formation de salariés.<br/><br/>
                Si votre entreprise nécissite la formation massive d'employés dispersés dans des agences dans tous les centres de formation, ce projet est fait pour vous.<br/>
                Ce projet permet de générer une solution 'idéale' à ce problème.<br/><br/>
                Les coûts sont fixés à :<br/>
                <ul>
                    <li>3 000 € par centre de formation ouvert</li>
                    <li>0.40 € par personne par km (* 2 pour l'aller retour)</li>
                </ul>
            </p>
            <h5>Etape suivante : ajout des agences et des lieux de formation !</h5>`,
            en: `<p>Optidis is a cost optimization project for trainings.<br/><br/>
                If your company needs to train a lot of its workers scattered in agencies in some possible training centers, this project is for you.<br/>
                This project permits to generate an 'ideal' solution to this problem.<br/><br/>
                Costs are the following :<br/>
                <ul>
                    <li>3 000 € per opened training center</li>
                    <li>0.40 € per people per km (* 2 for a two-way trip)</li>
                </ul>
            </p>
            <h5>Next step : we will add some agencies and training centers!</h5>`
        },
        isBig: true,
        rightButtonText: "<i class='fa fa-arrow-right'></i>",
        rightButtonJS: "insertDemoData(true)",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    },
    pdemo2: {
        title: {
            fr: "Ajout des agences et lieux de formation",
            en: "Agencies and training centers insertion"
        },
        body: {
            fr: `<p>
                10 agences et 25 lieux de formation ont été ajoutés sur la région parisienne.<br/>
                Legende :<br/>
                <img class='h1-5em' src='img/legend/agence.png' /> Agence<br/>
                <img class='h1-5em' src='img/legend/trainingcenter.png' /> Centre de formation fermé<br/>
                <img class='h1-5em' src='img/legend/trainingcentero.png' /> Centre de formation ouvert<br/>
                <img class='h1-5em' src='img/legend/affectation.png' /> Affectation d'une agence à un centre de formation
            </p>
            <h5>Etape suivante : exécution de l'algorithme hand-made !</h5>`,
            en: `<p>
                10 agencies and 25 training centers have just been inserted around Paris.<br/>
                Legend :<br/>
                <img class='h1-5em' src='img/legend/agence.png' /> Agency<br/>
                <img class='h1-5em' src='img/legend/trainingcenter.png' /> Closed training center<br/>
                <img class='h1-5em' src='img/legend/trainingcentero.png' /> Opened training center<br/>
                <img class='h1-5em' src='img/legend/affectation.png' /> Affectation of an agency to a training center
            </p>
            <h5>Next step : the hand-made algorithm execution!</h5>`
        },
        isBig: true,
        rightButtonText: "<i class='fa fa-arrow-right'></i>",
        rightButtonJS: "popups.showPopupFromObject('pExecAlgoHand');",
        hide: false,
        leftButtonText: "",
        leftButtonJS: ""
    }
}
