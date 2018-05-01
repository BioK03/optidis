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
	$("#range").html(newValue+" iteration(s)");
}

function showValue2(newValue)
{
    $nbGenerations = newValue;
    $("#rangeGen").html(newValue+" generation(s)");
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
            alert("Please fill at least the contant of the file and the format string");
            return;
        }
        if(($("#form_ag").val()).indexOf("id")>-1&&($("#form_ag").val()).indexOf("nom")>-1&&($("#form_ag").val()).indexOf("codepostal")>-1
            &&($("#form_ag").val()).indexOf("longitude")>-1&&($("#form_ag").val()).indexOf("latitude")>-1&&($("#form_ag").val()).indexOf("nbpersonnes")>-1)
        {
            var arrayPosition = $("#form_ag").val().replace(/"/g, "").split(";");
            var position = {
                id: arrayPosition.indexOf("id")!=-1?arrayPosition.indexOf("id"):function(){alert("Unable to parse 'id' from the format string");return null;},
                nom: arrayPosition.indexOf("nom")!=-1?arrayPosition.indexOf("nom"):function(){alert("Unable to pase 'nom' from the format string");return null;},
                codepostal: arrayPosition.indexOf("codepostal")!=-1?arrayPosition.indexOf("codepostal"):function(){alert("Unable to parse 'codepostal' from the format string");return null;},
                longitude: arrayPosition.indexOf("longitude")!=-1?arrayPosition.indexOf("longitude"):function(){alert("Unable to parse 'longitude' from the format string");return null;},
                latitude: arrayPosition.indexOf("latitude")!=-1?arrayPosition.indexOf("latitude"):function(){alert("Unable to parse 'latitude' from the format string");return null;},
                nbpersonnes: arrayPosition.indexOf("nbpersonnes")!=-1?arrayPosition.indexOf("nbpersonnes"):function(){alert("Unable to parse 'nbpersonnes' from the format string");return null;}
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
            alert("The format string must contain id, nom, codepostal, longitude, latitude, nbpersonnes");
        }
    }
    if($data == "Formation")
    {
        if($("#ta_lf").val()=="" || $("#form_lf").val()=="")
        {
            alert("Please fill at least the content of the file and the format string");
            return;
        }
        if(($("#form_lf").val()).indexOf("id")>-1&&($("#form_lf").val()).indexOf("nom")>-1&&($("#form_lf").val()).indexOf("codepostal")>-1
            &&($("#form_lf").val()).indexOf("longitude")>-1&&($("#form_lf").val()).indexOf("latitude")>-1)
        {
            var arrayPosition = $("#form_lf").val().replace(/"/g, "").split(";");
            var position = {
                id: arrayPosition.indexOf("id")!=-1?arrayPosition.indexOf("id"):function(){alert("Unable to parse 'id' from the format string");return null;},
                nom: arrayPosition.indexOf("nom")!=-1?arrayPosition.indexOf("nom"):function(){alert("Unable to pase 'nom' from the format string");return null;},
                codepostal: arrayPosition.indexOf("codepostal")!=-1?arrayPosition.indexOf("codepostal"):function(){alert("Unable to parse 'codepostal' from the format string");return null;},
                longitude: arrayPosition.indexOf("longitude")!=-1?arrayPosition.indexOf("longitude"):function(){alert("Unable to parse 'longitude' from the format string");return null;},
                latitude: arrayPosition.indexOf("latitude")!=-1?arrayPosition.indexOf("latitude"):function(){alert("Unable to parse 'latitude' from the format string");return null;}
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
            alert("The format string must contain id, nom, codepostal, longitude, latitude");
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
        $(this).html("<i class='fa fa-graduation-cap'></i> Display all training centers");
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
        $(this).html("<i class='fa fa-graduation-cap'></i> Hide the closed training centers");
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
        console.log("Launching the genetic algorithm with "+$nbIterations+" iterations and "+$nbGenerations+" generations");
        main.algoGenetique($nbIterations, $nbGenerations);
        $("#algoGenSpinDesc").html("Sending data...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html("Processing data...");
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse");
        }, 500);
    }
    if($numeroAlgo == 2)
    {
        console.log("Launching the hand-made algorithm with "+$nbIterations+" iterations");
        main.algoHand();
        $("#algoGenSpinDesc").html("Sending data...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html("Processing data...");
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse");
        }, 500);
    }
    if($numeroAlgo == 4)
    {
        console.log("Launching the tabu algorithm with "+$nbIterations+" iterations");
        main.algoTabou($nbIterations);
        $("#algoGenSpinDesc").html("Sending data...");
        $("#algoGenSpin").removeClass().addClass("fa fa-upload");
        setTimeout(function(){
            $("#algoGenSpinDesc").html("Processing data...");
            $("#algoGenSpin").removeClass().addClass("fa fa-spinner fa-pulse");
        }, 500);
    }
}

function callbackAlgo($numeroAlgo, $data)
{
    if($numeroAlgo == 1)
    {
        console.log("Genetic algorithm done");
        $("#algoGenSpinDesc").html("Displaying data...");
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>Results</h1>"
                +"<br/>Total cost : "+Math.trunc($data["coutTotal"])+" €"
                +"<br/>Open training centers: "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" processed agencies");
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
        console.log("Hand-made algorithm done");
        $("#algoGenSpinDesc").html("Displaying data...");
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>Results</h1>"
                +"<br/>Total cost : "+Math.trunc($data["coutTotal"])+" €"
                +"<br/>Open training centers : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" processed agencies");
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
        $("#algoGenSpinDesc").html("The server-side process has last more than the allowed duration (120 seconds) or has taken more than the allowed memory. Lower the number of iterations of the number of objects to process.");
    }
    if($numeroAlgo == 4)
    {
        console.log("Tabu algorithm done");
        $("#algoGenSpinDesc").html("Displaying data...");
        setTimeout(function(){
            $("#algoGenSpin").removeClass();
            $("#algoGenSpinDesc").html("<h1>Results</h1>"
                +"<br/>Total cost : "+Math.trunc($data["coutTotal"])+" €"
                +"<br/>Open training centers : "+$data["listLieuFormationOuvert"].length+"/"+main.data.lieuFormation.length
                +"<br/>"+$data["listAgence"].length+"/"+main.data.agences.length+" processed agencies");
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
    pdesc: "popups.showPopup(\"OPTIDIS powered by <a href='http://chbe.fr'><img class='imgLogoChbe' src='../../img/logob.png'/></a>\", \"OPTIDIS is a website for training efective transportation costs "
        +". In this model, OPTIDIS permits to optimize the employee training costs.<br/>Project developed by"
        +" Bertrand CHOUBERT, Damien CLARAS, and Thomas DATCU in the 'Discrete optimization' course, powered by <a href='http://chbe.fr'>CHBE</a>.<br/><span class='text-center center  col-xs-12'>"
        +"<img class='h4em' src='https://upload.wikimedia.org/wikipedia/commons/thumb/6/61/HTML5_logo_and_wordmark.svg/120px-HTML5_logo_and_wordmark.svg.png' title='HTML 5'/> <img class='h4em' src='http://www.astuces-webmaster.ch/tutos/css/css3.png' title='CSS 3'/> <img class='h4em' src='http://www.devictio.fr/wp-content/uploads/logo_javascript.png' title='JavaScript'/><br/><br/> <img class='h4em' src='http://www.alticreation.com/uploads/bootstrap.png' title='Bootstrap'/> <img class='h4em' src='http://mdbootstrap.com/wp-content/uploads/2015/12/mdb-white2.png' title='Material Design for Bootstrap'/><br/><br/><img class='h4em' src='http://www.weblisty.net/img/fontawesome.png' title='Font Awesome'/> <img class='h4em' src='http://ionicons.com/img/ionicons-logo.png' title='ionicons'/><br/><br/><img class='h4em' src='https://upload.wikimedia.org/wikipedia/en/9/9e/JQuery_logo.svg' title='jQuery'/><br/><br/><img class='h4em' src='https://lh3.googleusercontent.com/MOf9Kxxkj7GvyZlTZOnUzuYv0JAweEhlxJX6gslQvbvlhLK5_bSTK6duxY2xfbBsj43H=w300-rw' title='Google Maps API'/><br/><br/><img class='h4em' src='http://leafletjs.com/docs/images/logo.png' title='Leaflet'/> <img class='h4em' src='https://raw.githubusercontent.com/lvoogdt/Leaflet.awesome-markers/master/dist/images/markers-soft@2x.png' title='Leaflet awesome markers'/></span>"
        +"\", true, '', '', true, '', '');",
    p0: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", \""
        +"<p>Welcome to the configuration wizard of OPTIDIS</p>"
        +"\", true, \"Next\", \"eval($popups.p1);\", false, \"\", \"\");",
    p1: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", \""
        +"<div class='row'>"
            +"<p class='btn btn-default col-xs-offset-1 col-xs-8 noPadding' onclick='eval($popups.pAddAgency);'><i class='fa fa-street-view'></i> Assign agencies</p>"
            +"<p class='btn btn-default col-xs-1 col-xs-offset-1 noPadding' onclick='eval($popups.pDelAgency);'><i class='fa fa-times'></i></p>"
            +"<div class='col-xs-12'><hr class='sep'/></div>"
            +"<p class='btn btn-default col-xs-offset-1 col-xs-8 noPadding' onclick='eval($popups.pAddFormation);'><i class='fa fa-graduation-cap'></i> Assign training centers</p>"
            +"<p class='btn btn-default col-xs-1 col-xs-offset-1 noPadding' onclick='eval($popups.pDelFormation);'><i class='fa fa-times'></i></p>"
        +"</div>\", true, \"\", \"\", false, \"\", \"\");",
    pAddAgency: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", "
        +"\"<p>Assign agencies</p><br/><p class='btn btn-default col-xs-4' onclick='insererDonnees(2)'>100 default agencies</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(3)'>300 default agencies</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(4)'>500 default agencies</p><br/><br/><textarea id='ta_ag' class='textareacontent' placeholder='Paste here the agency list'></textarea><input id='cb_ag' type='checkbox'/><label for='cb_ag'>Delete the first line ?</label><br/><p>Enter the foramt string (must contain id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_ag' type='text' placeholder='Formatage'/>\", true, \"Confirm\",  \"validerDonnees('Agence');\", false, \"Back\", \"eval($popups.p1)\"); ",
    pNewAddAgency: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", "
        +"\"<p>Assign agencies</p><br/><p class='btn btn-default col-xs-4' onclick='insererDonnees(2)'>100 default agencies</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(3)'>300 default agencies</p><p class='btn btn-default col-xs-4' onclick='insererDonnees(4)'>500 default agencies</p><br/><br/><textarea id='ta_ag' class='textareacontent' placeholder='Paste here the agency list'></textarea><input id='cb_ag' type='checkbox'/><label for='cb_ag'>Delete the first line ?</label><br/><p>Enter here the format string (must contain id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_ag' type='text' placeholder='Format string'/>\", true, \"Confirm\",  \"validerDonnees('Agence');\", false, \"\", \"\"); ",
    pDelAgency: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration Wizard\", "
        +"\"<p>Delete agencies</p>\", true, \"\",  \"\", false, \"Back\", \"eval($popups.p1)\");",
    pAddFormation: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", "
        +"\"<p>Assign training centers</p><br/><p class='btn btn-default col-xs-12' onclick='insererDonnees(1)'>Default training centers</p><br/><br/><textarea id='ta_lf' class='textareacontent' placeholder='Paste here the training center list'></textarea><input id='cb_lf' type='checkbox'/><label for='cb_lf'>Delete the first line ?</label><br/><p>Enter the format string (must contain id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_lf' type='text' placeholder='Formatage'/>\", true, \"Confirm\",  \"validerDonnees('Formation')\", false, \"Back\", \"eval($popups.p1)\");",
    pNewAddFormation: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", "
        +"\"<p>Assign training centers</p><br/><p class='btn btn-default col-xs-12' onclick='insererDonnees(1)'>Default training centers</p><br/><br/><textarea id='ta_lf' class='textareacontent' placeholder='Paste here the training center list'></textarea><input id='cb_lf' type='checkbox'/><label for='cb_lf'>Delete the first line ?</label><br/><p>Enter the format string (must contain id, nom, codepostal, longitude, latitude, nbpersonnes): <br/><input id='form_lf' type='text' placeholder='Format String'/>\", true, \"Confirm\",  \"validerDonnees('Formation')\", false, \"\", \"\");",
    pDelFormation: "popups.showPopup(\"<i class='fa fa-magic'></i> Configuration wizard\", "
        +"\"<p>Delete the training centers</p>\", true, \"\",  \"\", false, \"Back\", \"eval($popups.p1)\");",
    pExecAlgoGen: "popups.showPopup(\"Execution of the genetic algorithm [WIP]\", "
        +"\"<input type='range' id='rangeAlgo' min='1' max='100' value='1' step='1' onchange='showValue(this.value)' /><span id='range'>1 iteration(s)</span><input type='range' id='rangeGenAlgo' min='1' max='20' value='1' step='1' onchange='showValue2(this.value)' /><span id='rangeGen'>1 generation(s)</span><i id='algoGenSpin'></i><span id='algoGenSpinDesc'></span>\", true, \"Launch execution\", \"executionAlgo(1);\", false, \"\", \"\")",
    pExecAlgoHand: "popups.showPopup(\"Execution of the hand-made algorithm\", "
        +"\"<i id='algoGenSpin'></i><span id='algoGenSpinDesc'></span>\", true, \"Launch execution\", \"executionAlgo(2);\", false, \"\", \"\")",
    pExecAlgoTab: "popups.showPopup(\"Executin of the tabu algorithm\", "
        +"\"<input type='range' id='rangeAlgo' min='1' max='100000' value='1' step='100' onchange='showValue(this.value)' /><span id='range'>1 iteration(s)</span><i id='algoGenSpin'></i><span id='algoGenSpinDesc'></span>\", true, \"Launch execution\", \"executionAlgo(4);\", false, \"\", \"\")"
}




/*


*/
