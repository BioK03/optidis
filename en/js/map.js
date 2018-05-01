
/*var directionsService = new google.maps.DirectionsService();

var request = {
    origin      : 'Av.+des+Champs-Élysées,+75008+ParisC',
    destination : '17+Rue+de+Bruxelles,+69100+Villeurbanne',
    travelMode  : google.maps.DirectionsTravelMode.DRIVING
};

directionsService.route(request, function(response, status) {
    if ( status == google.maps.DirectionsStatus.OK ) {
        //alert( response.routes[0].legs[0].distance.value ); // the distance in metres
    }
    else {
        console.error("Erreur de calcul de distance");
    }
});*/

L.AwesomeMarkers.Icon.prototype.options.prefix = 'fa';

var map = {
    map: L.map('map').setView([51.505, -0.09], 13),
    googleGeocodeProvider: new L.GeoSearch.Provider.Google(),
    featureGroups: {
        formation: L.featureGroup(),
        agences: L.featureGroup(),
        polylines: L.featureGroup()
    },
    icons: {
        agences: L.AwesomeMarkers.icon({
            icon: 'street-view',
            markerColor: 'red'
        }),
        formationFerme: L.AwesomeMarkers.icon({
            icon: 'mortar-board',
            markerColor: 'lightgray'
        }),
        formationOuvert: L.AwesomeMarkers.icon({
            icon: 'mortar-board',
            markerColor: 'green'
        }),
    },
    OpenStreetMap_Mapnik: function(){
        L.tileLayer('http://{s}.mqcdn.com/tiles/1.0.0/map/{z}/{x}/{y}.png', {
            subdomains: ['otile1','otile2','otile3','otile4'],
            maxZoom: 18
        }).addTo(map.map);
        L.control.scale().addTo(map.map);
        map.map.addLayer(map.featureGroups.formation);
        map.map.addLayer(map.featureGroups.agences);
        map.map.addLayer(map.featureGroups.polylines);
    },
    showResults: function(addressText) {
        map.googleGeocodeProvider.GetLocations(addressText, function(datapoints) {
            $res = "";
            for($i=0; $i<datapoints.length; $i++)
            {
                $res += "<p class='mapchoice' data-south='"
                    +datapoints[$i].bounds.getSouth()+"' data-west='"
                    +datapoints[$i].bounds.getWest()+"' data-north='"
                    +datapoints[$i].bounds.getNorth()+"' data-east='"
                    +datapoints[$i].bounds.getEast()+"' data-x='"
                    +datapoints[$i].X+"' data-y='"
                    +datapoints[$i].Y+"'><i class='fa fa-map-marker'></i> "
                    +datapoints[$i].Label+"</p>";
            }
            popups.showPopup("RESULTATS", $res, true, "", "", false, "", "");
            setTimeout(function(){
                $(".mapchoice").click(function(){
                    //map.map.panTo(new L.LatLng($(this).data("y"), $(this).data("x")));
                    var southWest = L.latLng($(this).data("south"), $(this).data("west")),
                        northEast = L.latLng($(this).data("north"), $(this).data("east")),
                        bounds = L.latLngBounds(southWest, northEast);
                    map.map.fitBounds(bounds, {animate: true});
                    $('#myModal').modal('hide');
                });
            }, 800);
        });
    },
    clearAgencesLayer: function(){
        map.featureGroups.agences.clearLayers();
    },
    clearFormationLayer: function(){
        map.featureGroups.formation.clearLayers();
    },
    clearPolylinesLayer: function(){
        map.featureGroups.polylines.clearLayers();
    },
    addPolyline: function($lat1, $long1, $lat2, $long2){
        L.polyline([[$lat1, $long1], [$lat2, $long2]], {color: 'blue'}).addTo(map.featureGroups.polylines);
    },
    addPointersList: function($pointers, $layer){ /* $pointers = [{longitude, latitude, nom}, ...], $layer = "agences"|"formation" */
        if($layer == "agences") {
            console.log("Adding "+$pointers.length+" formation pointers");
            //map.map.removeLayer(map.featureGroups.agences);
            map.clearAgencesLayer();
            for($i=0; $i<$pointers.length; $i++)
            {
                L.marker([$pointers[$i].latitude, $pointers[$i].longitude],
                     {icon: map.icons.agences}).addTo(map.featureGroups.agences).bindPopup("<b>"+$pointers[$i].nom+"</b><br/>"+$pointers[$i].nbpersonnes+" to train");
            }
            //map.map.addLayer(map.featureGroups.agences);
        }
        else if ($layer == "formation") {
            console.log("Adding "+$pointers.length+" formation pointers");
            //map.map.removeLayer(map.featureGroups.formation);
            map.clearFormationLayer();
            for($i=0; $i<$pointers.length; $i++)
            {
                if($pointers[$i].estOuvert)
                {
                    L.marker([$pointers[$i].latitude, $pointers[$i].longitude],
                        {icon: map.icons.formationOuvert}).addTo(map.featureGroups.formation).bindPopup($pointers[$i].nom);
                }
                else {
                    L.marker([$pointers[$i].latitude, $pointers[$i].longitude],
                        {icon: map.icons.formationFerme}).addTo(map.featureGroups.formation).bindPopup($pointers[$i].nom);
                }
            }
            //map.map.addLayer(map.featureGroups.formation);
        }
        else {
            console.error("addPointersList has received a bad layer name : layer=[agences, formation], given : "+$layer);
        }
        map.centerMap();
    },
    /*addPointer: function($x, $y, $popupContent){
        L.marker([$y, $x]).addTo(map.map).bindPopup($popupContent);
    },*/
    centerMap: function(){
        var bounds = null;
        if(map.featureGroups !== undefined && map.featureGroups.formation !== undefined && map.featureGroups.formation.getBounds())
        {
            if(bounds == null)
            {
                bounds = map.featureGroups.formation.getBounds();
            }
            else {
                bounds.extend(map.featureGroups.formation.getBounds());
            }
        }
        if(map.featureGroups !== undefined && map.featureGroups.agences !== undefined && map.featureGroups.agences.getBounds())
        {
            if(bounds == null)
            {
                bounds = map.featureGroups.agences.getBounds();
            }
            else {
                bounds.extend(map.featureGroups.agences.getBounds());
            }
        }
        if(bounds != null)
        {
            map.map.fitBounds(bounds, {animate : true});
        }
    },
};

map.OpenStreetMap_Mapnik();

document.getElementById('inputsearch').onkeypress = function(e){
    if (!e) e = window.event;
    var keyCode = e.keyCode || e.which;
    if (keyCode == '13'){
        map.showResults(this.value.replace(" ", ""));
        return false;
    }
}
