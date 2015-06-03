/**
 * ChatterController
 *
 * @description :: Server-side logic for managing chatters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var async = require('async');

 module.exports = {


  create: function(req,res,next){

  },

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
  //             chats.push({chat : chat , lastTime: chatter.lastTimeSeen, users : smallUsers});



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


  chatNotif: function(req, res){




  },

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
  //         chats.push({chat : chat , lastTime : chatter.lastTimeSeen});
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

