var lieuFormation = Class.create({

  initialize : function(idAgence, nom, codePostal, latitude, longitude, nombrePersonne){
    this.idLieuFormation = idLieuFormation;
    this.nom = nom;
    this.codePostal = codePostal;
    this.latitude = latitude;
    this.longitude = longitude;
    this.estOuvert = false;
    this.capacity = 60;
    this.nombrePersonne = 0;

  },

  getIdLieuFormation : function(){
    return this.idLieuFormation;
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

  setEstOuvert : function(bool){
    this.estOuvert = bool;
  },

  getEstOuvert : function(){
    return this.estOuvert;
  },

  getCapacity : function(){
    return this.capacity;
  },

  getNombrePersonne : function(){
    return this.nombrePersonne;
  },

  setNombrePersonne: function(nbPersonne){
    this.nombrePersonne = nbPersonne
  },


});
