/**
 * ActuController
 *
 * @description :: Server-side logic for managing actus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {


getNotif: function(req,res){
	Actu.find().where({user: req.param('id')}).exec(function(err,actus){
		if(err) return res.status(400).end();
		res.json(actus);
	});
},
getActu: function(req,res){
	var moment = require('moment');
	console.log(req.param('skip'));
	Actu.find({where: { or:[{related_user: req.param('friends'),typ:['footConfirm','newFriend','demandAccepted']},
		{user:req.param('friends'),typ:['hommeDuMatch','chevreDuMatch','newFriend']}], id: {'>': req.param('skip')}}
		,sort:'createdAt DESC',limit:30},function(err,actu){
			console.log(actu);
			var notMine = _.filter(actu,function(elem){return elem.user!=req.param('user')&&elem.related_user != req.param('user')});
			var result = _.groupBy(notMine, function(elem){return moment(elem.createdAt).lang('fr').format('L')});
			res.status(200).json(result);
		});
},
newNotif: function(req,res){
	Actu.create(req.params.all(),function(err,actu){
		if(err) return res.status(400).end();
		Connexion.find().where({user: req.param('user')}).exec(function(err,connexions){
			if(err) return res.status(400).end();
				if(!connexions[0]) return res.status(200).end(); // Si l'utlisateur n'est pas connecté on envoi rien.
				_.each(connexions,function(connexion){
					sails.sockets.emit(connexion.socket_id,'notif',actu);   // Envoi un évènement socket.
				});
				res.status(200).end();
			});
	});
}

	// footInvit: function(req,res){
	// 	var toFinish = 0;
	// 	var related;
	// 	if(req.param('from'))
	// 		related = req.param('from');
	// 	else
	// 		related = req.param('created_by');
	// 	async.each(req.param('toInvite'),function(player,callback){
	// 		Actu.create({user: player, related_user: related, typ: 'footInvit', related_stuff: req.param('id')},function(err,actu){
	// 			if(err) return res.status(400).end();
	// 			Connexion.find().where({user : player}).exec(function(err,connexions){
	// 				if(err) return res.status(400).end();
	// 				if(connexions[0]){   //On verifie que l'utilsateur est connecté, (pas de return car on est dans une boucle).
	// 					_.each(connexions,function(connexion,index){
	// 							sails.sockets.emit(connexion.socket_id,'notif',actu);   // Envoi un évènement socket.
	// 							if(index==connexions.length-1)
	// 								callback();
	// 					});
	// 				}	
	// 				else callback();
	// 			});
	// 		});
	// 	},function(){
	// 		return res.status(200).end();
	// 	});
	// }


};

