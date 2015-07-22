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

  addToChat: function(req, res, next){
      Chat.find({related:req.param('related')}).exec(function(err, chat){
        Chatter.create({user:req.param('user'), chat:chat.id}).exec(function(err, chatter){
          User.findOne(req.param('user')).exec(function(err,user){
            sails.sockets.emit(connexion.socket_id,'newChatter',{chat:chat.id, user: {id: user.id, first_name: user.first_name, picture : user.picture, last_name:user.last_name } });
          });
        });
      });
  },

  deactivateFromChat: function(req, res){
    Chatter.update({chat:req.param('chat'), user:req.param('user')},{deactivate:true}).exec(function(err,chatter){
      return res.status(200).end();
    });
  }

  //get all chats for a given user
  // getAllChats: function (req, res, next){
  //   var chats = new Array();

  //   Chatter.find({id:req.param('id')}).exec(function(err,chatters){

  //     if(err){
  //       return res.status(406).end();         
  //     }

  //     async.each(chatters,function(chatter,callback){
  //       Chat.findOne({id:chatter.chat}).populate('messages').exec(function(err,chat){
  //         if(err){
  //           return res.status(406).end();         
  //         }

  //         Chatter.find({chat:chatter.chat, user: { '!': req.param('id') }}).exec(function(err, usersChatters){
  //           var usersID = _.pluck(usersChatters, 'id');
  //           User.find(usersID).exec(function(err, bigUsers){

  //             var smallUsers = _.chain(users).ToolsService.pluckMany( "first_name", "picture", "id").value();
  //             chats.push({chat : chat , lastTime: chatter.last_time_seen, users : smallUsers});



  //           });
  //         });
  //       });

  //     }, function(err){
  //       if(err){
  //         console.log(err);
  //       }
  //       else {
  //         return res.status(200).json(chats);
  //       }
  //     });


  //   });


  // },



  // getChatNotifAtLaunch : function (req, res){

  //   var chats = new Array();

  //   Chatter.find({id:req.param('id')}).exec(function(err,chatters){

  //     if(err){
  //       return res.status(406).end();         
  //     }

  //     async.each(chatters,function(chatter,callback){

  //       Chat.findOne({id:chatter.chat}).exec(function(err,chat){
  //         if(err){
  //           return res.status(406).end();         
  //         }
  //         chats.push({chat : chat , lastTime : chatter.last_time_seen});
  //       });

  //     }, function(err){
  //       if(err){
  //         console.log(err);
  //       }
  //       else {
  //         return res.status(200).json(chats);
  //       }
  //     });

  //   });

  // }


};

