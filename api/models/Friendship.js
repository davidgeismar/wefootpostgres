module.exports = {

  attributes: {
  	user1:{
  		type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id'
  	},
  	user2:{
  		type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id'  		
  	},
  	statut:{
  		type: 'integer', //0=friends, 1= 1st added 2nd as Fav, 2= opposite, 3= both, -2= 1st blocked, -4= 2nd
  		defaultsTo: 0
  	}
  }
};
