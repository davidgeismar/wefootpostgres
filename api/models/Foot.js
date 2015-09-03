/**
* Foot.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	id: {
      type: 'int',
      autoIncrement: true,
      primaryKey: true
    },
    date: {
      type: 'datetime',
      required : true
    },
    nb_player: {
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
    friend_can_invite: {   //FRIEND CAN INVITE FRIEND
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
    created_by: {
      type: 'integer',
      foreignKey: true,
      references: 'user',
      on: 'id'
    },
    confirmed_players: {
      type: 'integer',
      defaultsTo: 1
    }
    // chat:{
    //   model:'chat'
    // }


  }
};

