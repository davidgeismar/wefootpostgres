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
    var users = req.param('users');
    if(users){
      Chat.findOne({related:req.param('related')}).exec(function(err, chat){
        async.each(users, function(user, callback){
          Chatter.create({user:user, chat:chat.id}).exec(function(err, chatter){
            User.findOne(user).exec(function(err,user){
              Connexion.findOne({user: req.param('user')},function(err,connexion){
                if(err || !connexion)
                  return res.status(400).end();
                sails.sockets.emit(connexion.socket_id,'newChatter',{chat:chat.id, user: {id: user.id, first_name: user.first_name, picture : user.picture, last_name:user.last_name } });
                callback();
              });
            });
          });
        },function(err){
          return res.status(200).end();
        });
      });
    }
    else
      return res.status(400).end();
  },

  deactivateFromChat: function(req, res){
    Chatter.update({chat:req.param('chat'), user:req.param('user')},{deactivate:true}).exec(function(err,chatter){
      return res.status(200).end();
    });
  }


};

