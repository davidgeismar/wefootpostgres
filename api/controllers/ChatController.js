/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var async = require('async');
 var merge = require('merge');

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
      Chatter.create({user:user,chat:chat.id}, function chatterCreated(err, chatter){});
      callback();
    }, function(err){
      if(err){
        console.log(err);
      }
      else {
        User.find({id:req.param('users')}).exec(function(err,bigUsers){
          var smallUsers = shrinkUsers(bigUsers);
          Connexion.find({user:req.param('users')}).exec(function(err, connexions){
            if(connexions){
              async.each(connexions,function(connexion,callback){
                sails.sockets.emit(connexion.socketId,'newChat',merge({id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, related:chat.related}, {lastTime: null}, { users : smallUsers}));
                callback();
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

  //get all chats for a given user
  getAllChats: function (req, res, next){
    var chats = new Array();

    Chatter.find({user:req.param('id')}).exec(function(err,chatters){
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

            Chatter.find({chat:chatter.chat}).exec(function(err, usersChatters){
              if(usersChatters){
                var usersID = _.pluck(usersChatters, 'user');
                console.log(usersID);
                User.find(usersID).exec(function(err, bigUsers){
                  if(err){
                    console.log(err);
                    return res.status(406).end();         
                  }
                  var smallUsers = shrinkUsers(bigUsers);
                  chats.push(merge({id:chat.id, typ:chat.typ, desc:chat.desc, messages:chat.messages, updatedAt:chat.updatedAt, related:chat.related }, {lastTime: chatter.lastTimeSeen}, { users : smallUsers}));
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


getUnseenMessages: function (req, res, next){
  var unseenMessages = new Array();
  Chatter.find({user:req.param('id')}).exec(function(err,chatters){
    if(err){
      return res.status(406).end();         
    }
    async.each(chatters,function(chatter,callback){
      var params = {};
      if(chatter.lastTimeSeen)
        params = { chat:chatter.chat, createdAt: { '>=': lt}};
      else
        params = { chat:chatter.chat};
      var lt = chatter.lastTimeSeen;
      Message.find(params).exec(function(err, messages){
        if(messages)
          unseenMessages.push({chat:chatter.chat, messages:messages});
      })
      callback();
    },function(err){
      return res.status(200).json(unseenMessages);

    });
  });
},
  // getAllChats: function (req, res, next){
  //   var chats = new Array();
  //   var i = 0;

  //   User.find({id:req.param('id')}).populate('chats').exec(function(err,user){

  //     if(err){
  //       return res.status(406).end();         
  //     }



  //     user[0].chats.forEach(function(chat){

  //       Chat.find({id:chat.id}).populate('messages').populate('chatters').exec(function(err,chat){
  //         if(err){
  //           return res.status(406).end();         
  //         }

  //         chats[i]=chat[0];

  //         i++;

  //         if(user[0].chats.length==chats.length){
  //           return res.json({status:200,chats:chats});
  //         }
  //       });

  //     });




  //   });



  // },

  getChatNotif : function (req, res){

    var chats = new Array();

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
            chats.push({chat : chat , lastTime : chatter.lastTimeSeen});
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

  },

  // getAllMessages: function (req, res, next){
  //   var messages = new Array();
  //   var i = 0;
  //   Chat.find({id:req.param('id')}).populate('messages').exec(function(err,user){
  //     if(err){
  //       return res.status(406).end();         
  //     }
  //     _.each(user.chats, function(chat){
  //       Chat.find({id:chat.id}).populate('messages').exec(function(err,chat){
  //         if(err){
  //           return res.status(406).end();         
  //         }

  //         chats[i]=chat;
  //         i++;

  //       });
  //     });

  //     res.status(200).json(chats);

  //   });



  // },


  // testSocket: function(req,res,next){
  //   if(req.isSocket){
  //     Chat.find({id : req.param('chats')}).exec(function(e,chatlist){
  //       Chat.subscribe(req.socket, chatList);
  //     });
  //   }
  // },


};

