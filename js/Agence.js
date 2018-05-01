var Agence = Class.create({


    initialize : function(idAgence, nom, codePostal, latitude, longitude, nombrePersonne){

        this.idAgence = idAgence;
        this.nom = nom;
        this.codePostal = codePostal;
        this.latitude = latitude;
        this.longitude = longitude;
        this.nombrePersonne = nombrePersonne;
        this.lieuFormation = null;
        this.traiter = false;

    },

    getidAgence : function(){
        return this.idAgence;
    },

    getNom : function(){
        return this.nom;
    },

    getCodePostal : function(){
        return this.codePostal;
    },

    getLatitude : function(){
        return this.latitude;
    },

    getLongitude : function(){
        return this.longitude;
    },

    getNombrePersonne : function(){
        return this.nombrePersonne;
    },

    getLieuFormation : function(){
        return this.lieuFormation;
    },

    setLieuFormation : function(LieuForm){
        this.lieuFormation = LieuForm;
    },

    getTraiter : function(){
        return this.traiter;
    },

    setTraiter : function(traiter){
        this.traiter = traiter;
    }
});
