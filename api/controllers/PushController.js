/**
 * PushController
 *
 * @description :: Server-side logic for managing pushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var async = require('async');

 module.exports = {

 	create: function(req,res) {
 		Push.find(req.param('push_id')).exec(function(err,push){
 			if(err) { console.log(err); return res.status(400).end();}
 			if(push.length==0){
 				Push.create(req.params.all(),function(err){
 					if(err) { console.log(err); return res.status(400).end();}
 					return res.status(200).end();
 				});
 			}
 			else if (push.length>0){
 				push.forEach(function(onePush){
 					if(onePush.user!=req.param('user')){
 						Push.destroy(onePush.push_id);
 					}
 				});
 				return res.status(200).end();
 			}

 			else res.status(200).end();
 		});
 	},

 	sendPush: function(req,res){
 		var pushText = req.param('text');
 		
 		Push.find({user: req.param('user')},function(err,pushes){

 			if(err){console.log(err); return res.status(400).end();}
 			if(pushes.length==0) return res.status(200).end();
 			User.findOne({id: req.param('user')},function(err,user){
 				if(err){console.log(err); return res.status(400).end();}
 				user.pending_notif++;
 				user.save();
 				
 				PushService.sendPush(pushes);

 				return res.status(200).end();

 			});
 		});
 	},



 };

