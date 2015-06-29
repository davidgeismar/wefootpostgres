module.exports = {

  attributes: {
  	
  	socket_id: {
  		type: 'string',
  		primaryKey: true
  	},
  	user: {
  		type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id'  
  	}
  }
};

