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
    duree:{
      type:'integer',
      enum:[60,90,120]
    }
  }
};