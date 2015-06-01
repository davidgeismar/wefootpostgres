/**
* Foot.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	id: {
      type: 'float',
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: 'date',
      required : true
    },
    nbPlayer: {
      type: 'integer',
      required : true
    },
    priv: {
      type: 'boolean',
      required : true
    },
    level: {
      type: 'integer',
      required: true
    },
    friendCanInvite: {   //FRIEND CAN INVITE FRIEND
      type: 'boolean',
      required: true
    },
    // ONE FIELD FOR MANY FOOTS
    field: {
    	type: 'integer',
      foreignKey: true,
      references: 'field',
      on: 'id'  
    },
    booked: {
      type: 'boolean',
      defaultsTo: false
    },
    chat:{
      model:'chat'
    }


  }
};

