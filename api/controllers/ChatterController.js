/**
 * ChatterController
 *
 * @description :: Server-side logic for managing chatters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var async = require('async');
 var moment = require('moment');

 var shrinkUsers = function(users){
  return _.map(users, function(obj) { return _.pick(obj, 'first_name','last_name' ,'picture', 'id'); });
};
module.exports = {

  //Met à jour le last time seen, à base de popopop et tout ça dans ma benzbenzbenz
  updateLts: function(req,res,next){
    var currentTime = new Date();
    Chatter.update({user:req.param('user'), chat:req.param('chat')}, {last_time_seen:currentTime}).exec(function(err, chatter){
      return res.status(200).end();
    });

  },

  addToChat: function(req, res, next){
    var newChatters = req.param('users');
    var oldChatters = req.param('chatters');
    if(newChatters && oldChatters){
      Chat.findOne({related:req.param('related')}).populate('messages').exec(function(err, chat){
        if(err){ console.log(err); return res.status(400).end();}
        Connexion.find({user:oldChatters},function(err,connexions){
          async.each(newChatters, function(user, callback){
            Chatter.findOrCreate({user:user, chat:chat.id}).exec(function(err, chatter){
              if(err){ console.log(err); return res.status(400).end();}
              User.findOne(user).exec(function(err,user){
                if(err){ console.log(err); return res.status(400).end();}
                if(connexions){
                  async.each(connexions, function(connexion, callback2){
                    sails.sockets.emit(connexion.socket_id,'newChatter',{chat:chat.id, user: {id: user.id, first_name: user.first_name, picture : user.picture, last_name:user.last_name }});
                    callback2();
                  },function(err){
                    callback();
                  });
                }
              });
            });
          },function(err){
            Chatter.find({chat:chat.id}).exec(function(err,chatters){
              var usersId = _.pluck(chatters,'user');
              User.find(usersId).exec(function(err,users){
                var smallUsers = shrinkUsers(users);
                Connexion.find({user:req.param('users')}).exec(function(err, connexions){
                  if(connexions){
                    async.each(connexions,function(connexion,callback3){
                      sails.sockets.emit(connexion.socket_id,'newChat',{id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, createdAt:chat.createdAt,  updatedAt:chat.updatedAt, related:chat.related ,lastTime: moment(), users : smallUsers});
                      callback3();
                    },function(err){
                      return res.status(200).end();
                    });
                  }
                })
              })
            });
          });
});
});
}
},

deactivateFromChat: function(req, res){
  Chatter.update({chat:req.param('chat'), user:req.param('user')},{deactivate:true}).exec(function(err,chatter){
    return res.status(200).end();
  });
}


};

