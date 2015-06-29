/**
 * PushController
 *
 * @description :: Server-side logic for managing pushes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

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
 			else res.status(200).end();
 		});
 	},
 	sendPush: function(req,res){
 		var apn = require('apn');
 		console.log('herreee');
 		Push.find({user: req.param('user')},function(err,pushId){
 			if(err){console.log(err); return res.status(400).end();}
 			if(pushId.length==0) return res.status(200).end();
 			_.each(pushId,function(device){
 				var device = new apn.Device(device.push_id);
 				var note = new apn.Notification();
 				note.badge = 1;
 				note.contentAvailable = 1;
 				note.sound = "ping.aiff";
 				note.alert = {
 					body : req.param('texte')
 				};
 				note.device = device;
 				var options = {
 					gateway: 'gateway.sandbox.push.apple.com',
 					errorCallback: function(error){
 						console.log('push error', error);
 					},
 					cert: 'PushNewsCert.pem',
 					key:  'PushNewsKey.pem',
 					passphrase: 'lemonde',
 					port: 2195,
 					enhanced: true,
 					cacheLength: 100
 				};
 				var apnsConnection = new apn.Connection(options);
 				apnsConnection.sendNotification(note);
 				return res.status(200).end();
 			});
 		});
 	}


 };

