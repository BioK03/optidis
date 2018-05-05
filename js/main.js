var main = {
    host: "http://localhost",
    data: {
        agences: [],/* {id, nom, latitude, longitude, codepostal, nbpersonnes,idLieuDeFormation} */
        lieuFormation: [],/* {id, nom, codepostal, latitude, longitude,capaciteInitialie, capaciteRestante,estOuvert} */
        nbIte: 0,
        solution: {
            coutTotal: -1,
            listLieuFormationOuvert: [],
            listAgence : []
        } /*coutTotal, listLieuFormationOuvert, listAgence */
    },

    algoHand: function(){
        var dataAction =  {
            "agences": main.data.agences,
            "lieuFormation": main.data.lieuFormation,
            "key": getStoredKey()
        };

        var jsondata;
        var data = JSON.stringify(dataAction);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", main.host+"/optidis/handmade.php", !0);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                jsondata = JSON.parse(xhr.responseText);
                console.log(jsondata);
                callbackAlgo(4, jsondata);
            }
            else if(xhr.readyState === 4 && xhr.status === 403) {
                callbackAlgo(1, "");
            }
            else {
                callbackAlgo(3, "");
            }
        }
    },

    algoTabou: function($nbIte){
        var dataAction =  {
            "agences": main.data.agences,
            "lieuFormation": main.data.lieuFormation,
            "nbIte": $nbIte,
            "key": getStoredKey()
        };

        var jsondata;
        var data = JSON.stringify(dataAction);

        var xhr = new XMLHttpRequest();
        xhr.open("POST", main.host+"/optidis/tabou.php", !0);
        xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
        xhr.send(data);
        xhr.onreadystatechange = function () {
            if (xhr.readyState === 4 && xhr.status === 200) {
                jsondata = JSON.parse(xhr.responseText);
                console.log(jsondata);
                callbackAlgo(2, jsondata);
            }
            else if(xhr.readyState === 4 && xhr.status === 403) {
                callbackAlgo(1, "");
            }
            else {
                callbackAlgo(3, "");
            }
        }
    },

    fermerLieuxFormation: function(){
        for($i=0; $i<main.data.lieuFormation.length; $i++)
        {
            main.data.lieuFormation[$i].estOuvert = false;
        }
        map.clearFormationLayer();
        map.addPointersList(main.data.lieuFormation, "formation");
    }
};
