/**
* Notation.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

	attributes: {

		id:{
			type:'int',
			primaryKey: true,
			autoIncrement: true
		},

  	//Personne notée
  	note:{
  		model:'user'
  	},

  	//Personne qui note
  	noteur:{
  		model:'user'
  	},

  	frappe: {
  		type:'float'
  	},
  	physique: {
  		type:'float'
  	},
  	technique: {
  		type:'float'
  	},
  	fair_play: {
  		type:'float'
  	},
  	assiduite: {
  		type:'float'
  	}

  }
};

