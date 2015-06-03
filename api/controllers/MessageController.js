 

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

 					chat.messages.add(message.id);

 					chat.save(function(err) {
 						if(err){
 							console.log(err);
 							return res.status(406).end(); 
 							}        
 						});
 						Connexion.findOne({user:2}).exec(function(err, connexion){

 							//async.each(connexions,function(connexion,callback){
 								sails.sockets.emit(connexion.socketId,'message',{from: req.param('senderId'),typ: 'messageReceived',message:message.messagestr});
 								return res.status(200).json(message);
 							});
 							//,function(err){
 								
 							//});
 						//});






 				});
 			}

 		});


 	}

 }