/**
* Push.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		push_id:{
			type:'string',
			primaryKey: true
		},

		user:{
			model:'user'
		},
		is_ios:{
			type:'boolean'
		}
		
	}
};

