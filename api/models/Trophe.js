/**
* Trophe.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

  		id:{
			type: 'int',
			autoIncrement: true,
			primaryKey: true
		},
		foot:{
			model:'foot',
			required:true
		},
		user:{
			model:'user',
			required:true
		},
		//0 = chevre, 1 = homme
		trophe:{
			type:'int',
			required:true
		}
		// ,
		// nbVotes:{
		// 	type:'int',
		// 	required:true
		// }

  }
};

