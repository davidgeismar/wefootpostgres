module.exports = {

  attributes: {
  	foot:{
  		type: 'integer',
  		foreignKey: true,
    	references: 'foot',
   		on: 'id'
  	},
  	user:{
  		type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id'  		
  	},
  	statut:{
  		type: 'integer', // 0 invited, 1 playing, 2 denied, 3 organisator
  		defaultsTo: 0
  	}
  }
};