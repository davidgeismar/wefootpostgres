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
	},

	field: {
		type: 'string',
		required: true
	},
	alert: {
		type: 'boolean',
		defaultsTo: false
	},
	paid: {
		type: 'boolean',
		defaultsTo: false
	}
  }
}