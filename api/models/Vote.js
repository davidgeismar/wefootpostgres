/**
* Election.js
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

		electeur:{
			model:'user'
		},
		elu:{
			model:'user'
		},
		foot:{
			model:'foot'
		},
    //1 = homme du match, 2 = chevre du match
    note:{
    	type:'integer'
    }


}
};

