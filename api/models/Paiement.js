module.exports = {
  attributes: {

  	user:{
  		type: 'string',
  		required: true
	},
	foot:{
		model: 'foot',
		primaryKey: true
	},

	preauth_id:{
		type:'string',
		required: true
	},

	price: {
		type: 'string',
		required: true
	}
  }
}