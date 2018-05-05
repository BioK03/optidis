<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

?>


<!DOCTYPE html>
<html>
    <head>
        <title>OPTIDIS by CHBE</title>
        <meta charset="UTF-8">
        
        <link rel="stylesheet" href="lib/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="lib/fontawesome/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="lib/ionicons/css/ionicons.min.css"/>
        <link rel="stylesheet" href="lib/mdb/css/mdb.min.css"/>
        <link rel="stylesheet" href="lib/leaflet/leaflet.css"/>
        <link rel="stylesheet" href="lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css"/>
        <link rel="stylesheet" href="lib/geosearchmaster/css/l.geosearch.css"/>
        <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>

        <link rel="stylesheet" href="css/agences.css"/>
    </head>
    <body>
        <div class="modal fade" id="myModal" role="dialog">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <button type="button" class="close" data-dismiss="modal">&times;</button>
                        <h4 class="modal-title"></h4>
                    </div>
                    <div class="modal-body">
                        <p></p>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-default" data-dismiss="modal"><i class="fa fa-times"></i></button>
                    </div>
                </div>
            </div>
        </div>

        <nav class="navbar default-color">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#bs-example-navbar-collapse-2">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                </div>

                <div class="collapse navbar-collapse" id="bs-example-navbar-collapse-2">
                    <ul class="nav navbar-nav">
                        <li>
                            <span class="menuOpti">
                                <i>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                    <span class="icon-bar"></span>
                                </i>
                            </span>
                        </li>
                    </ul>
                    <ul class="nav navbar-nav2">
                        <li id="liLogo">
                            <a id="logoProj" class="navbar-brand" href="#"><img id="logoOptidis" src="img/logo.png"/></a>
                        </li>
                    </ul>
                    <ul class="navbar-right navbar-form">
                        <li class="nav-item languageSelector dropdown">
                            <a class="nav-link dropdown-toggle" id="navbarDropdownMenuLink" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
                                <span class="selectedLanguage" data-toggle="tooltip" data-placement="bottom" title="NEW !">English</span>
                                <i class="fa fa-caret-down"></i>
                            </a>
                            <div class="dropdown-menu dropdown-primary" aria-labelledby="navbarDropdownMenuLink">
                                <a class="dropdown-item" href="#" data-lang="en">English</a>
                                <a class="dropdown-item" href="#" data-lang="fr">Français</a>
                            </div>
                        </li>
                        <li class="nav-item form-inline waves-effect waves-light">
                            <input id="inputsearch" type="text" class="form-control" placeholder="Search" autocomplete="off" />
                        </li>
                    </ul>
                </div>
            </div>
        </nav><!--
        --><div id="menu">
            <div class="divider-new col-xs-12"><i class="fa fa-magic fa-fw"></i> <span id="titleConf">Configuration assistant</span></div>
            <ul class="col-xs-11 col-xs-offset-1">
                <li id="affAg"><i class='fa fa-street-view fa-fw'></i> <span class="textContent">Agencies insertion</span> <span class="protagen"></span></li>
                <li id="affLF"><i class='fa fa-graduation-cap fa-fw'></i> <span class="textContent">Training centers insertion</span> <span class="protagen"></span></li>
                <li id="reinitMap"><i class='fa fa-times fa-fw'></i> <span class="textContent">Map reset</span></li>
                <li id="maskClose" data-hide="hide"><i class='fa fa-graduation-cap fa-fw'></i> <span class="textContent">Hide closed training centers</span></li>
            </ul>
            <div class="divider-new col-xs-12"><i class="fa fa-cogs fa-fw"></i> <span id="titleAlgo">Algorithms</span></div>
            <ul class="col-xs-11 col-xs-offset-1">
                <li id="execAlgoHand"><i class="fa fa-hand-paper-o fa-fw"></i> <span class="textContent">Launch hand-made algorithm</span> <span class="protagen"></span></li>
                <li id="execAlgoTab"><i class="fa fa-ban fa-fw"></i> <span class="textContent">Launch tabou algorithm</span> <span class="protagen"></span></li>
            </ul>
            <div class="divider-new col-xs-12"><i class="fa fa-bookmark fa-fw"></i> <span class="titleInfo">Information</span></div>
            <ul class="col-xs-11 col-xs-offset-1">
                <li id="licenseLi"><i class="fa fa-print fa-fw"></i> <span class="textContent">Optidis Licence</span></li>
                <li id="expAlgoHM"><i class="fa fa-hand-paper-o fa-fw"></i> <span class="textContent">Hand-made algorithm explanation</span></li>
                <li id="expAlgoTab"><i class="fa fa-ban fa-fw"></i> <span class="textContent">Tabou algorithm explanation</span></li>
            </ul>
            <input id="inputKey" type="password" class="form-control" placeholder="Enter your key here..." autocomplete="off" />
        </div><!--
        --><div id="map">
            <span id="centerMap" onclick="map.centerMap('all');"><i class="icon ion-arrow-shrink"></i> <div class="textContent">CENTER MAP</div></span>
        </div><!--
        --><span id="demoMenu"><i class="fa fa-play fa-fw"></i> INFO / DEMO</span>    

        <!-- GRAPHIC LIBRARIES -->
        <script type="text/javascript" src="lib/jquery/jquery.min.js"></script>
        <script type="text/javascript" src="lib/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="lib/mdb/js/mdb.min.js"></script>

        <!-- MAP & GEOCODING LIBRARIES-->
        <script type="text/javascript" src="lib/leaflet/leaflet.js"></script>
        <script type="text/javascript" src="lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js"></script>
        <script type="text/javascript" src="lib/geosearchmaster/js/l.control.geosearch.js"></script>
        <script type="text/javascript" src="lib/geosearchmaster/js/l.geosearch.provider.google.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3"></script>

        <!-- CUSTOM CODE -->
        <script type="text/javascript" src="js/languageChooser.js"></script>
        <script type="text/javascript" src="js/setDefaultValues.js"></script>
        <script type="text/javascript" src="js/keyStorage.js"></script>
        <script type="text/javascript" src="js/stylescript.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/prescript.js"></script>
        <script type="text/javascript" src="js/map.js"></script>
    </body>
</html>
