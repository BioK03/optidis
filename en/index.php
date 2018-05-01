<!DOCTYPE html>
<html>
    <head>
        <title>OPTIDIS by CHBE</title>
        <meta charset="UTF-8">
        <link rel="stylesheet" href="../lib/bootstrap/css/bootstrap.min.css"/>
        <link rel="stylesheet" href="../lib/fontawesome/css/font-awesome.min.css"/>
        <link rel="stylesheet" href="../lib/ionicons/css/ionicons.min.css"/>
        <link rel="stylesheet" href="../lib/mdb/css/mdb.min.css"/>
        <link rel="stylesheet" href="../lib/leaflet/leaflet.css"/>
        <link rel="stylesheet" href="../lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.css"/>
        <link rel="stylesheet" href="../lib/geosearchmaster/css/l.geosearch.css"/>
        <link href='https://fonts.googleapis.com/css?family=Montserrat:400,700' rel='stylesheet' type='text/css'>

        <link rel="stylesheet" href="../css/agences.css"/>
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
                        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
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
                            <a id="logoProj" class="navbar-brand" href="#"><img id="logoOptidis" src="../img/logo.png"/> <i class="fa fa-info-circle"></i></a>
                        </li>
                    </ul>
                    <form class="navbar-form navbar-right" role="search">
                        <div class="form-group waves-effect waves-light">
                            <input id="inputsearch" type="text" class="form-control" placeholder="Search" autocomplete="off">
                        </div>
                    </form>
                    <!--<ul class="nav navbar-nav navbar-right">
                        <li>
                            <a id="assistant-init" href="#" class="waves-effect waves-light">
                                <i class="fa fa-magic"></i> Assistant de configuration
                            </a>
                        </li>
                    </ul>-->
                </div>
            </div>
        </nav><!--
        --><div id="menu">
            <div class="divider-new col-xs-12"><i class="fa fa-magic"></i> Configuration wizard</div>
            <ul class="col-xs-11 col-xs-offset-1">
                <li id="affAg"><i class='fa fa-street-view'></i> Assign agencies</li>
                <li id="affLF"><i class='fa fa-graduation-cap'></i> Assign training centers</li>
                <li id="reinitMap"><i class='fa fa-times'></i> Reset the map</li>
                <li id="reinitFormation"><i class='fa fa-refresh'></i> Close the training centers</li>
                <li id="maskClose" data-hide="hide"><i class='fa fa-graduation-cap'></i> Hide the closed training centers</li>
            </ul>
            <div class="divider-new col-xs-12"><i class="fa fa-cogs"></i> Algorithms</div>
            <ul class="col-xs-11 col-xs-offset-1">
                <li id="execAlgoHand"><i class="fa fa-hand-paper-o"></i> Launch the hand-made algorithm</li>
                <li id="execAlgoGen"><i class="fa fa-code-fork"></i> Launch the genetic algorithm [WIP]</li>
                <li id="execAlgoTab"><i class="fa fa-ban"></i> Launch the tabu algorithm</li>
            </ul>
            <div class="divider-new col-xs-12"><i class="fa fa-bookmark"></i> Licenses</div>
            <ul class="col-xs-11 col-xs-offset-1">
                <li id="licenseLi"><i class="fa fa-print"></i> OptiDis license</li>
            </ul>
        </div><!--
        --><div id="map">
            <span id="centerMap" onclick="map.centerMap('all');"><i class="icon ion-arrow-shrink"></i> <div>CENTER THE MAP</div></span>
        </div>


        <!-- GRAPHIC LIBRARIES -->
        <script type="text/javascript" src="../lib/jquery/jquery.min.js"></script>
        <script type="text/javascript" src="../lib/bootstrap/js/bootstrap.min.js"></script>
        <script type="text/javascript" src="../lib/mdb/js/mdb.min.js"></script>

        <!-- MAP & GEOCODING LIBRARIES-->
        <script type="text/javascript" src="../lib/leaflet/leaflet.js"></script>
        <script type="text/javascript" src="../lib/Leaflet.awesome-markers/dist/leaflet.awesome-markers.min.js"></script>
        <script type="text/javascript" src="../lib/geosearchmaster/js/l.control.geosearch.js"></script>
        <script type="text/javascript" src="../lib/geosearchmaster/js/l.geosearch.provider.google.js"></script>
        <script type="text/javascript" src="https://maps.googleapis.com/maps/api/js?v=3"></script>

        <!-- CUSTOM CODE -->
        <!--<script type="text/javascript" src='js/Agence.js'></script>
        <script type="text/javascript" src='js/LieuFormation.js'></script>-->
        <script type="text/javascript" src="js/setDefaultValues.js"></script>
        <script type="text/javascript" src="js/stylescript.js"></script>
        <script type="text/javascript" src="js/main.js"></script>
        <script type="text/javascript" src="js/prescript.js"></script>
        <script type="text/javascript" src="js/map.js"></script>
        <script type="text/javascript" src="js/postscript.js"></script>
        <script type="text/javascript">
            /*map.addPointersList([
                {x:30, y:40, text:"1"},
                {x:31, y:40, text:"2"},
                {x:32, y:40, text:"3"},
                {x:33, y:40, text:"4"},
            ], "formation");*/

    	</script>
    </body>
</html>
