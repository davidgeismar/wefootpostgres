/**
 * ChatterController
 *
 * @description :: Server-side logic for managing chatters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var async = require('async');


 module.exports = {

  //Met à jour le last time seen, à base de popopop et tout ça dans ma benzbenzbenz
  updateLts: function(req,res,next){
    var currentTime = new Date();
    Chatter.update({user:req.param('user'), chat:req.param('chat')}, {last_time_seen:currentTime}).exec(function(err, chatter){
      return res.status(200).end();
    });

  },

  // addToChat: function(req, res, next){
  //   var users = req.param('users');
  //   var newChatters = req.param('chatters');

  //   if(users){
  //     Chat.findOne({related:req.param('related')}).populate('message').exec(function(err, chat){
  //       if(err){ console.log(err); return res.status(400).end();}


  //       async.each(users, function(user, callback){

  //         Chatter.create({user:user, chat:chat.id}).exec(function(err, chatter){
  //           if(err){ console.log(err); return res.status(400).end();}
  //           User.findOne(user).exec(function(err,user){
  //             async.each(newChatters, function(chatter, callback2){
  //             Connexion.findOne({user:chatter.user},function(err,connexion){
  //               if(err){ console.log(err); return res.status(400).end();}
  //               if(connexion)
  //               sails.sockets.emit(connexion.socket_id,'newChatter',{chat:chat.id, user: {id: user.id, first_name: user.first_name, picture : user.picture, last_name:user.last_name } });
  //               callback2();
  //             });
  //           },function(err){
  //             Chatter.find({chat:chat.id}).exec(function(err,chatters){
  //               async.each(chatters, function(chatter, callback3){
                
  //             });
  //           });
  //         });
  //       },function(err){
  //         return res.status(200).end();
  //       });
  //     });
  //   }
  //   else
  //     return res.status(400).end();
  // },

  deactivateFromChat: function(req, res){
    Chatter.update({chat:req.param('chat'), user:req.param('user')},{deactivate:true}).exec(function(err,chatter){
      return res.status(200).end();
    });
  }


};

