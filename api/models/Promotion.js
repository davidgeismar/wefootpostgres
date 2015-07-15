module.exports = {

  attributes: {
  	id:{
     type:'integer',
     primaryKey: true,
     autoIncrement: true     
    },
  	heureDebut:{
  		type:'datetime',
      required: true,
  	},
    heureFin:{
      type:'datetime',
      required: true,
    },
  	repetitions:{
  		type:'int',
  		required: true,
  	},
    promo:{
      type:'double',
      required: true,
    },
    terrain:{
      type:'int',
      required: true,
    }
  }
};