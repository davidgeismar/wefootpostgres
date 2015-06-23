/**
 * PushController
 *
 * @description :: Server-side logic for managing pushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {

	create: function(req,res) {
		Push.create(req.params.all(),function(err){
			if(err) { console.log(err); return res.status(400).end();}
			return res.status(200).end();
		});
	}
	
	
};

