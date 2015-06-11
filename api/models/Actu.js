/**
* Actu.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {
  	id: {
 		type: 'int',
  		primaryKey: true,
 		autoIncrement: true
	},
	user: {
	  	type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id'  
	},
	related_user: {
		type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id' 
	},
	typ: {
		type: 'string',
		enum: ['newFriend','endGame','hommeDuMatch','footInvit','messageReceived','footConfirm','footAnnul','footDemand']
	},
	related_stuff :{
		type: 'integer'
	}
}
};

