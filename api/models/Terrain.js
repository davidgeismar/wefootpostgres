module.exports = {

  attributes: {
  	id:{
     type:'integer',
     primaryKey: true,
     autoIncrement: true     
    },
  	field:{
  		type:'integer',
      foreignKey: true,
  		references: 'field',
      on:'id',
      required: true
  	},
    prix:{
      type:'integer',
      required: true,
    },
    indoor:{
      type:'boolean'
    }
  }
};