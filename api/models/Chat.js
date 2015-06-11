/**
* Chat.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // adapter : 'mongodb',
  // schema : true,

  attributes: {

    id: {
      type:'int',
      primaryKey: true,
      autoIncrement: true
    },
      // typ=1 : chat à 2, typ=2 : chat d'un foot, typ=3 : chat d'un defi
      typ: {
        type:'int'
      },
      //foot ou défi avec caractéristiques
      desc:{
        type:'string'
      },

    //MANY USERS FOR MANY CHATS

    related: {
      type: 'int'
    },
    //MANY MESSAGES FOR ONE CHAT
    messages: {
    	collection: 'message',
    	via : 'chat'
    }


  }
};

