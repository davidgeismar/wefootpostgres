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
  		type: 'integer', // 0 Pending, 1 invited, 2 playing, 3 organisator
  		defaultsTo: 0
  	}
  }
};