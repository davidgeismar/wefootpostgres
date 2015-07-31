/**
* Field.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {

  beforeCreate: function (attrs, next) {


    var geocoderProvider = 'google';
    var httpAdapter = 'https';
// optionnal
var extra = {
    apiKey: 'AIzaSyCwDEs1V_woC81ZRweT8uKCvgWOqICR_9M', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
  };

  var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);

// Using callback
geocoder.geocode(attrs.address + " " + attrs.zip_code + " "+ attrs.city, function(err, res) {
  if(res[0].latitude && res[0].longitude){
    attrs.lat = res[0].latitude;
    attrs.longi = res[0].longitude;
  }
  else {
    attrs.lat = 0;
    attrs.longi = 0;
  }
  if(res[0].city)
    attrs.city = res[0].city;
  if(res[0].streetNumber && res[0].streetName)
    attrs.address = res[0].streetNumber +", " + res[0].streetName;
  else if(!res[0].streetNumber && res[0].streetName)
    attrs.address = res[0].streetName;
  else if(!res[0].streetNumber && !res[0].streetName)
    attrs.address = res[0].streetNumber +", " + res[0].streetName;

  attrs.cleanname = ToolsService.clean(attrs.name)+ToolsService.clean(attrs.city);
  next();
});


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
mail:{
  type: 'string',
  email: true
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
    },
    partner:{
      type: 'boolean'
    },
    api_ref:{
      type: 'string',    //Function in ResaService for the field
      defaultsTo: false
    },
    student_discount:{
      type:'double',
      defaultsTo:0
    }
  }
};

