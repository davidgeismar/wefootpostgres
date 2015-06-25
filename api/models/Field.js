/**
* Field.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {

  beforeCreate: function (attrs, next) {
    // var publicConfig = {
    //   key: 'AIzaSyCwDEs1V_woC81ZRweT8uKCvgWOqICR_9M'
    // };
    // var gmAPI = new GoogleMapsAPI(publicConfig);

    attrs.cleanname = ToolsService.clean(attrs.name)+ToolsService.clean(attrs.city);

    // var geocodeParams = {
    //   "address":    attrs.address + " " + attrs.zip_code + " " + attrs.city,
    //   "components": "components=country:FR",
    //   "language":   "fr",
    //   "region":     "fr"
    // };

    // gmAPI.geocode(geocodeParams, function(err, result){
    //   console.log(result);
    // });
    next();

  },

  attributes: {

  	id: {
      type: 'float',
      autoIncrement: true,
      primaryKey: true
    },
    name: {
     type: 'string',
     required: true
   },
   address: {
     type: 'string',
     required: true
   },
   city: {
     type: 'string',
     required: true
   },
   zip_code: {
     type:'integer',
     required:true
   },
   picture: {
     type: 'string',
     defaultsTo: 'img/field_default.jpg'
   },
   origin:{
     type: 'string',
     required:true,
     enum:['private','public']
   },
   cleanname: {
    type: 'string'
  },
  telephone: {
    type: 'string'
  },
    //IF ORIGIN = PRIVATE related_to = user, else related_to = center
    related_to:{
      type: 'integer'
    },
    lat:{
      type: 'double'
    },
    longi:{
      type:'double'
    }
  }
};

