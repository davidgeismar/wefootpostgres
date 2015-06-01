/**
 * ChatterController
 *
 * @description :: Server-side logic for managing chatters
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {

 	getAllChats: function (req, res, next){
  var chats = new Array();
  var i = 0;

  Chatter.find({id:req.param('id')}).exec(function(err,chatters){

    if(err){
      return res.status(406).end();         
    }


    chatters.forEach(function(chatter){

      Chat.find({id:chatter.chat}).populate('messages').exec(function(err,chat){
        if(err){
          return res.status(406).end();         
        }

        chats[i]={chat : chat[0] , lastTime: chatter.lastTimeSeen};

        i++;

        if(user[0].chats.length==chats.length){
          return res.json({status:200,chats:chats});
        }
      });

    });

  });


    


}


 };

