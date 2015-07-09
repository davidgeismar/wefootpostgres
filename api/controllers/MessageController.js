 

module.exports = {

 	//Création d'un message contenu dans un chat
 	create: function(req, res, next){
 		Message.create(req.params.all()).exec(function(err, message) {
 			if(err){
 				console.log(err);
 				return res.status(406).end();         
 			}
 			else
 			{
 				Chat.findOne({id:req.param('chat')}).exec(function(err, chat){
 					if(err){
 						console.log(err);
 						return res.status(406).end();         
 					}
 					//On ajoute un message au chat
 					chat.messages.add(message.id);
 					chat.save(function(err) {
 						if(err){
 							console.log(err);
 							return res.status(406).end(); 
 						}        
 					});
 						//On envoie le message aux users par socket
 						var users = new Array();
 						users =_.pluck(req.param('receivers'), 'id');
 						//NO NEED
 						// users.push(req.param('sender_id'));
 						console.log("users");
 						console.log(users);
 						Connexion.find({user:users}).exec(function(err, connexions){
 							if(connexions){
 								async.each(connexions,function(connexion,callback){
 									sails.sockets.emit(connexion.socket_id,'newMessage',{sender_id: req.param('sender_id'),messagestr:message.messagestr, chat:req.param('chat'), createdAt:message.createdAt});
 									callback();
 								}
 								,function(err){
 									return res.status(200).end();
 								});
 							}
 						});
 					});
 			}
 		});
}
}