/**
* Field.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

    beforeCreate: function (attrs, next) {

      attrs.cleanName = ToolsService.clean(attrs.name);
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
    }
}
};

