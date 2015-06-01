module.exports = {

setSocket: function(req,res){   //Link a connexion with an user
		if(req.isSocket){
			Connexion.create({socketId: sails.sockets.id(req.socket),user: req.param('id')},function(err,sock){
				if(err){ console.log(err); res.status(400).end();}
				res.status(200).end();
			});
		}
		else{
			res.status(400).end();
		}
	},

	delete: function(req,res){
		if(req.isSocket){
			Connexion.destroy({user: req.param('id')},function(err){
				if(err){ console.log(err); res.status(400).end();}
				res.status(200).end();
			});
		}
		else{
			res.status(400).end();
		}
	}


};

