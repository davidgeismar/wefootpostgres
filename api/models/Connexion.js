module.exports = {

  attributes: {
  	
  	socketId: {
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

