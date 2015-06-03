/**
* Field.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    beforeCreate: function (attrs, next) {

      attrs.cleanname = ToolsService.clean(attrs.name)+ToolsServiceService.clean(attrs.city);
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
    	//required:true
    },
    picture: {
    	type: 'string'
    },
    origin:{
    	type: 'string',
    	required:true
    },
    cleanname: {
        type: 'string'
    },
    telephone: {
        type: 'string'
    }
}
};

