module.exports = {

  attributes: {

  	id:{
     type:'integer',
     primaryKey: true,
     autoIncrement: true     
    },
    terrain:{
      type:'integer'
    },
    field:{
      type:'integer'
    },
    user:{
      type:'integer'
    },
  	date:{
  		type:'datetime',
  		required: true,
  	},
    date_fin:{
      type:'datetime',
      required:true
    }
  }
};