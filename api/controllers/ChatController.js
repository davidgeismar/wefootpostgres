/**
 * ChatController
 *
 * @description :: Server-side logic for managing chats
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {

   create: function(req, res, next){
    console.log(req.params.all());
    Chat.create({typ:req.param('typ')}, function chatCreated(err, chat){
      if(err){
        console.log("1"+err);
        return res.status(406).end();         
      }

      chat.chatters.add(req.param('chatters'));
      chat.save(function(err){
        if(err){
          console.log("2"+err);
          return res.status(406).end();
        }
      });
      // chat.populate('chatters').exec(function(err,chatp){
      //   console.log(chatp);
      // });

//       // User.find({id : [req.param('userId1'), req.param('userId2')]}).exec(function(err, users){
//       //   console.log("users"+users[0]);
//       //   users[0].chats.add(chat.id);
//       //   users[1].chats.add(chat.id);

//       //   users[0].save(function(err){
//       //     if(err){
//       //       console.log("3"+err);
//       //       return res.status(406).end();         
//       //     }

//       //   });

//       //   users[1].save(function(err){
//       //     if(err){
//       //       console.log("4"+err);
//       //       return res.status(406).end();         
//       //     }

//       //   });
//       // console.log(chat);

//       // users[0].populate('chats').exec(function(err, user){
//       //   console.log("populate"+user);
//       // });


      // });  

return res.json({status:200,chat:chat});

});


},

getAllChats: function (req, res, next){
  var chats = new Array();
  var i = 0;

  User.find({id:req.param('id')}).populate('chats').exec(function(err,user){

    if(err){
      return res.status(406).end();         
    }



    user[0].chats.forEach(function(chat){

      Chat.find({id:chat.id}).populate('messages').exec(function(err,chat){
        if(err){
          return res.status(406).end();         
        }

        chats[i]=chat[0];

        i++;

        if(user[0].chats.length==chats.length){
          return res.json({status:200,chats:chats});
        }
      });

    });

    


  });



},

getAllMessages: function (req, res, next){
  var messages = new Array();
  var i = 0;
  Chat.find({id:req.param('id')}).populate('messages').exec(function(err,user){
    if(err){
      return res.status(406).end();         
    }
    _.each(user.chats, function(chat){
      Chat.find({id:chat.id}).populate('messages').exec(function(err,chat){
        if(err){
          return res.status(406).end();         
        }

        chats[i]=chat;
        i++;

      });
    });

    res.status(200).json(chats);

  });



},


testSocket: function(req,res,next){
  if(req.isSocket){
    Chat.find({id : req.param('chats')}).exec(function(e,chatlist){
      Chat.subscribe(req.socket, chatList);
    });
  }
},



// addMessage: function(req, res, next){
//   Chat.find({id:req.param('chatId')}).exec(function(err, chat) {
//     if(err){
//       return res.status(406).end();         
//     }


//     chat.message.add(req.param(''))


//   });
// }


};

