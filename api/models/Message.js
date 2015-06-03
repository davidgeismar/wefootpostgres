/**
* Message.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // adapter : 'mongodb',
    // schema : true,
  // autoPK: false,

  
  attributes: {

  	id: {
      primaryKey: true,
      autoIncrement: true,
      type:'integer'
    },

    senderId: {
    	type: 'integer',
      required: true
    },

    messagestr: {
      type: 'string',
      required: true
    },  	

  	    //ONE CHAT FOR MANY MESSAGES
    chat: {
    	model:'chat'
    }


  }
};

