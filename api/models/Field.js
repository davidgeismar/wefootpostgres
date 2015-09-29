/**
* Field.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/



module.exports = {

  beforeCreate: function (attrs, next) {
    attrs.cleanname = ToolsService.clean(attrs.name)+ToolsService.clean(attrs.city);
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
     type: 'string'
   },
   city: {
     type: 'string'
   },
   zip_code: {
     type:'integer'
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
  type: 'float'
},
longi:{
  type:'float'
},
partner:{
  type: 'boolean'
},
api_ref:{
  type: 'string',    //Function in ResaService for the field
  defaultsTo: false
},
student_discount:{
  type:'float',
  defaultsTo:0
}
}
};

