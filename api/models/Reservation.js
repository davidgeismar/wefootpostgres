module.exports = {

  attributes: {

  	id:{
     type:'integer',
     primaryKey: true,
     autoIncrement: true     
    },
    
    terrain:{
      type:'integer',
      foreignKey: true,
      references: 'terrain',
      on:'id',
      required: true
    },

  	date:{
  		type:'datetime',
  		required: true,
  	},
  }
};