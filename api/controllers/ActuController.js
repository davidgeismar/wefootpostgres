/**
 * ActuController
 *
 * @description :: Server-side logic for managing actus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

	getNotif: function(req,res){
		Actu.find().where({user: req.param('id'),typ:['newFriend','hommeDuMatch','footInvit','footConfirm','chevreDuMatch']}).exec(function(err,actus){
			if(err) return res.status(400);
			res.json(actus);
		});
	},
	newFriend: function(req,res){
		Actu.create({user: req.param('user2'), related_user: req.param('user1'), typ: 'newFriend'},function(err,actu){
			if(err) return res.status(400);
			Connexion.findOne().where({user: req.param('user2')}).exec(function(err,connexion){
				if(err) return res.status(400);
				if(connexion.length == 0) return res.status(200); // Si l'utlisateur n'est pas connecté on envoi rien.
            	sails.sockets.emit(connexion.socketId,'notif',{from: req.param('user1'),typ: 'newFriend'});   // Envoi un évènement socket.
            	return res.status(200);
       		 });
		});
	},

	footInvit: function(req,res){
		var toFinish = 0;
		_.each(req.param('toInvite'),function(player){
			Actu.create({user: player, related_user: req.param('created_by'), typ: 'footInvit'},function(err){
				if(err) return res.status(400);
				Connexion.findOne().where({user : player}).exec(function(err,connexion){
					if(err) return res.status(400);
					if(connexion)   //On verifie que l'utilsateur est connecté, (pas de return car on est dans une boucle).
						sails.sockets.emit(connexion.socketId,'notif',{from: req.param('user1'),typ: 'footInvit'});   // Envoi un évènement socket.
					toFinish++;
					if(toFinish==req.param('toInvite').length)// Comme la boucle est asynchrone capte que tout soit fini.
						return res.status(200);
				});
			});
		});
	}

	

};

