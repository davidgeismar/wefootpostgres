/**
 * ActuController
 *
 * @description :: Server-side logic for managing actus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getNotif: function(req,res){
		Actu.find().where({user: req.param('id'),typ:['newFriend','hommeDuMatch','footInvit','footConfirm','chevreDuMatch']}).exec(function(err,actus){
			if(err) return res.status(400).end();
			res.json(actus);
		});
	},
	newNotif: function(req,res){
		Actu.create(req.params.all(),function(err,actu){
			if(err) return res.status(400).end();
			Connexion.findOne().where({user: req.param('user')}).exec(function(err,connexion){
				if(err) return res.status(400).end();
				if(!connexion) return res.status(200).end(); // Si l'utlisateur n'est pas connecté on envoi rien.
				console.log(connexion);
            	sails.sockets.emit(connexion.socketId,'notif',actu);   // Envoi un évènement socket.
            	return res.status(200).end();
       		 });
		});
	},

	footInvit: function(req,res){
		var toFinish = 0;
		var related;
		if(req.param('from'))
			related = req.param('from');
		else
			related = req.param('created_by');
		async.each(req.param('toInvite'),function(player,callback){
			Actu.create({user: player, related_user: related, typ: 'footInvit', related_stuff: req.param('id')},function(err,actu){
				if(err) return res.status(400).end();
				Connexion.findOne().where({user : player}).exec(function(err,connexion){
					if(err) return res.status(400).end();
					if(connexion)   //On verifie que l'utilsateur est connecté, (pas de return car on est dans une boucle).
						sails.sockets.emit(connexion.socketId,'notif',actu);   // Envoi un évènement socket.
					callback();
				});
			});
		},function(){
			return res.status(200).end();
		});
	}
};

