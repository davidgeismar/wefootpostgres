 /**
* Chatter.js
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
 	chat:{
 		model:'chat'
 	},
 	user:{
 		model:'user'
 	},
 	last_time_seen:{
 		type:'datetime'
 	},
 	deactivate:{
 		type:'boolean',
 		DefaultsTo:false
 	}
 	
  }
};

