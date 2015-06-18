module.exports = {

  attributes: {
  	
  	socketId: {
  		type: 'string',
  		primaryKey: true
  	},
    pushId:{
      type: 'string'
    },
  	user: {
  		type: 'integer',
  		foreignKey: true,
    	references: 'user',
   		on: 'id'  
  	}
  }
};

