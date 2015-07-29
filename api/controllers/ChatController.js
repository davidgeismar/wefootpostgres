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
              async.each(connexions,function(connexion,callback2){
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
            if(err || !chat){
              console.log(err);
              return res.status(406).end();         
            }

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

  Chatter.find({ user:req.param('id'), createdAt: { '>=': lastTimeUpdated}}).exec(function(err, chatters){
    if(err){
      console.log(err);
      return res.status(406).end();  
    }
    if(chatters)
    {
      var chatsId = _.pluck(chatters,'chat');
      Chat.find(chatsId).exec(function(err, chats){
        async.each(chats, function(chat, callback){
          Chatter.find({chat:chat.id}).exec(function(err, chatters){
            if(err){
              console.log(err);
              return res.status(406).end();  
            }
            var usersId = _.pluck(chatters, 'user');
            User.find(usersId).exec(function(err, users){
              var smallUsers = shrinkUsers(users);
              newChats.push({id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, createdAt:chat.createdAt, updatedAt:chat.updatedAt, related:chat.related ,lastTime: null, users : smallUsers});
            });
          });
          callback()
        },function(err){
          return res.status(200).json(newChats);
        });
      });
    }
    else
      return res.status(200).end();
  });
},

getNewChatters: function (req, res, next){
  var lastTimeUpdated = req.param('ltu');
  var chats = req.param('chats');

  Chatter.find({ chat:chats, createdAt: { '>=': lastTimeUpdated}}).exec(function(err,chatters){
    if(err){
      console.log(err);
      return res.status(406).end();         
    }
    var usersId = _.pluck(chatters, 'user');
    User.find(usersId).exec(function(err, users){
      var smallUsers = shrinkUsers(users);
      return res.status(200).json(smallUsers);
    });


  });
},


getUnseenMessages: function (req, res, next){
  var unseenMessages = [];
  var lastTimeUpdated = req.param('ltu');
  
  Chatter.find({user:req.param('id')}).exec(function(err,chatters){
    if(err){
      return res.status(406).end();         
    }
    if(chatters){
      async.each(chatters,function(chatter,callback){
        Message.find({ chat:chatter.chat, createdAt: { '>=': lastTimeUpdated}}).exec(function(err, messages){
          if(messages)
            unseenMessages.push({chat:chatter.chat, messages:messages});
        })
        callback();
      },function(err){
        return res.status(200).json(unseenMessages);
      });
    }
    else
     return res.status(200).end();         
   
 });
},

getChatNotif : function (req, res){

  var chats = [];

  Chatter.find({id:req.param('id')}).exec(function(err,chatters){

    if(err){
      return res.status(406).end();         
    }
    if(chatters){
      async.each(chatters,function(chatter,callback){

        Chat.findOne({id:chatter.chat}).exec(function(err,chat){
          if(err){
            return res.status(406).end();         
          }
          chats.push({chat : chat , lastTime : chatter.last_time_seen});
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
    else return res.status(200).end();
  });

}

};

