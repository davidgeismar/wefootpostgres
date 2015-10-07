/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var async = require('async');
 var merge = require('merge');
 var moment = require('moment');
 
 var shrinkUsers = function(users){
  return _.map(users, function(obj) { return _.pick(obj, 'first_name','last_name' ,'picture', 'id'); });
};

module.exports = {

 create: function(req, res, next){
  Chat.create({typ:req.param('typ'), desc:req.param('desc'), related:req.param('related')}, function chatCreated(err, chat){
    if(err){
      return res.status(406).end();         
    }
    async.each(req.param('users'),function(user,callback){
      Chatter.create({user:user,chat:chat.id}, function chatterCreated(err, chatter){ callback();});
    }, function(err){
      if(err){
        console.log(err);
      }
      else {
        User.find({id:req.param('users')}).exec(function(err,bigUsers){
          var smallUsers = shrinkUsers(bigUsers);
          Connexion.find({user:req.param('users')}).exec(function(err, connexions){
            if(connexions){
              // var allSocks = JSON.stringify(sails.sockets.subscribers());
              async.each(connexions,function(connexion,callback2){
                // if(allSocks.indexOf(connexion.socket_id)>-1)
                sails.sockets.emit(connexion.socket_id,'newChat',merge({id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, related:chat.related}, {lastTime: null}, { users : smallUsers}));
                callback2();
              }
              ,function(err){
                return res.status(200).end();
              });
            }
          });      
        });
      }
    });
});
},

//get a chat for a given user
getChat: function (req, res, next){
  var related = req.param('related');
  Chat.findOne({related:related}).populate('messages').exec(function(err,chat){
    if(err){
      console.log(err);
      return res.status(406).end();         
    }
    if(!chat)
      return res.status(200).end();
    Chatter.find({chat:chat.id}).exec(function(err, usersChatters){
      if(err){
        console.log(err);
        return res.status(406).end();         
      }
      var currentChatter = _.find(usersChatters, function(chatter){return chatter.user==req.param('id')});
      if(currentChatter){
        currentChatter.deactivate = false;
        currentChatter.save();
      }
      var usersID = _.pluck(usersChatters, 'user');

      User.find(usersID).exec(function(err, bigUsers){
        if(err){
          console.log(err);
          return res.status(406).end();         
        }
        var smallUsers = shrinkUsers(bigUsers);
        return res.status(200).json({id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, createdAt:chat.createdAt,  updatedAt:chat.updatedAt, related:chat.related ,lastTime: moment(), users : smallUsers});
      });
    });

  });


},

//get all chats for a given user
getAllChats: function (req, res, next){
  var chats = new Array();

  Chatter.find({user:req.param('id'), deactivate:0}).exec(function(err,chatters){
    if(err){
      console.log(err);
      return res.status(406).end();         
    }
    if(chatters){
      async.each(chatters,function(chatter,callback){
        Chat.findOne({id:chatter.chat}).populate('messages').exec(function(err,chat){
          if(err){
            console.log(err);
            return res.status(406).end();         
          }
          else if(!chat){
            callback();
          }
          else{
            Chatter.find({chat:chatter.chat}).exec(function(err, usersChatters){
              if(usersChatters){
                var usersID = _.pluck(usersChatters, 'user');
                User.find(usersID).exec(function(err, bigUsers){
                  if(err){
                    console.log(err);
                    return res.status(406).end();         
                  }
                  var smallUsers = shrinkUsers(bigUsers);
                  chats.push({id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, createdAt:chat.createdAt,  updatedAt:chat.updatedAt, related:chat.related ,lastTime: chatter.last_time_seen, users : smallUsers});
                  callback();
                });
              }
              else{
                callback();
              }
            });
          }
        });

}, function(err){
  if(err){
    console.log(err);
  }
  else {
    return res.status(200).json(chats);
  }
});
}
});
},


getNewChats: function (req, res){
  var newChats = [];
  var lastTimeUpdated = req.param('ltu');

  Chatter.find({ user:req.param('id'), createdAt: { '>': lastTimeUpdated}}).exec(function(err, chatters){
    console.log(chatters);
    if(err){
      console.log(err);
      return res.status(406).end();  
    }
    if(chatters.length>0)
    {
      var chatsId = _.pluck(chatters,'chat');
      Chat.find(chatsId).exec(function(err, chats){
      // _.map(chats, function(obj) { return _.pick(obj, 'id','typ' ,'desc', 'id'); }); {id:chat.id, typ:chat.typ, desc:chat.desc, messages:[], createdAt:chat.createdAt, updatedAt:chat.updatedAt, related:chat.related ,lastTime: null, users : smallUsers});
      _.each(chats, function(element, index) {
        chats[index] = _.extend(element, {messages: []}, {lastTime: null}, {users: []});
      }); 
      return res.status(200).json(chats);
    });
    }
    else
      return res.status(200).end();
  });
},

getNewChatters: function (req, res, next){
  var lastTimeUpdated = req.param('ltu');
  var chats = req.param('chats');
  var chatters = [];
  async.each(chats, function(chat, callback){
    Chatter.findOne({ chat:chat, createdAt: { '>': lastTimeUpdated}}).exec(function(err,chatter){
      if(chatter){
        if(err){
          console.log(err);
          return res.status(406).end();         
        }
        User.findOne(chatter.user).exec(function(err, user){
          if(user){
            chatters.push({user:user, chat:chatter.chat});
            callback();
          }
          else
            callback();
        });
      }
      else
        callback();
    });
  }, function(){
    return res.status(200).json(chatters);
  });
},

getUnseenMessages: function (req, res, next){
  var unseenMessages = [];
  var lastTimeUpdated = req.param('ltu');
  var chats = req.param('chats');
  Message.find({ chat:chats, createdAt: { '>': lastTimeUpdated}}).limit(20000).sort({createdAt: 'asc'}).exec(function(err, messages){
    if(err){
      console.log(err);
      return res.status(406).end();         
    }
    if(messages.length>0)
      return res.status(200).json(messages); 
    else
      return res.status(200).end(); 
  });
}

};

