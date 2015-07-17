/**
 * Created by jaumard on 27/02/2015.
 */
 var async = require('async');
 var moment = require('moment');

 module.exports.schedule = {

      //Check end election
      //Everyday at 2:30AM
      "30 2 * * *"  : function ()
      {
      	var nowMinus3d = moment().subtract(3, 'days').format('YYYY-MM-DD HH:MM:SS');
        var nowMinus4d = moment().subtract(4, 'days').format('YYYY-MM-DD HH:MM:SS');

          // On sélectionne les gagnants des foots qui ont plus de 3 jours et qui ne sont terminés  		
          Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot group by v.chevre, v.foot where f.date <"+nowMinus3d+" and f.date > "+nowMinus4d+") x group by foot",function(err,results){

           if(results){
            async.each(results, function(result, callback){
              Trophe.create({foot:result.foot, trophe:0, user:result.chevre, nbVotes:result.maxVotes});
              Actu.create({user:result.chevre, related_user:result.chevre, typ:'chevreDuMatch', related_stuff:foot.id}).exec(function(err,actu){
                if(err)
                  console.log(err);
                Connexion.findOne({user:result.chevre}).exec(function(err, connexion){
                  if(connexion){
                    sails.sockets.emit(connexion.socket_id,'notif',actu);
                  }
                });

              });
              callback();
            }, function(err){
            });
          }
        });

Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot group by v.homme, v.foot where f.date <"+nowMinus3d+" and f.date > "+nowMinus4d+") x group by foot",function(err,results){
 if(results){
  async.each(results, function(result, callback){
    Trophe.create({foot:result.foot, trophe:1, user:result.homme, nbVotes:result.maxVotes});
    Actu.create({user:result.homme, related_user:result.homme, typ:'hommeDuMatch', related_stuff:foot.id}).exec(function(err,actu){
      if(err)
        console.log(err);
      Connexion.findOne({user:result.homme}).exec(function(err, connexion){
        if(connexion){

          sails.sockets.emit(connexion.socket_id,'notif',actu);
        }
      });

    });
    callback();
  }, function(err){

  });
}
});
},

      //Check end foot, trigger vote for each player
      //Every 4 hours
      "0 */4 * * *": function ()
      {

        var nowPlus4h = moment().add(4, 'hours').format();
        var nowPlus8h = moment().add(8, 'hours').format();

        Foot.find({ date: { '<': nowPlus8h, '>': nowPlus4h }}).exec(function(err, foots){
          async.each(foots, function(foot, callback){
            Player.find({foot:foot.id}).exec(function(err, players){
              async.each(players, function(player, callback2){
                Actu.create({user:player.user, related_user:foot.created_by, typ:'endGame', related_stuff:foot.id}).exec(function(err,actu){
                  if(err)
                    console.log(err);
                  Connexion.findOne({user:player.user}).exec(function(err, connexion){
                    if(connexion){
                      sails.sockets.emit(connexion.socket_id,'notif',actu);
                    }
                  });
                });
                callback2();
              },function(err){

              });

            });
            callback();
          }, function(err){
          });
        });

      },


//SEND PUSH TO WARN USER ABOUT COMMING FOOT
'*/10 * * * *' : function ()
{
  var nowMinus3h10min = moment().subtract(3, 'hours').subtract(10, 'minutes').format();
  var nowMinus3h = moment().subtract(3, 'hours').format();


  Foot.find({ date: { '>': nowMinus3h10min, '<': nowMinus3h }}).exec(function(err, foots){

    async.each(foots, function(foot, callback){
      Player.find({foot:foot.id}).exec(function(err, players){
        //We send pushes
        var usersId = _.pluck(players, 'user');
        Push.find({user:usersId}).exec(function(err, pushes){
          if(pushes){
            PushService.sendPush(pushes);
          }
        });
       //We create actu and send it by socket
       async.each(players, function(player, callback2){
        Actu.create({user:player.user, related_user:player.user, typ:'3hoursBefore', related_stuff:foot.id}).exec(function(err,actu){
          if(err)
            console.log(err);
          Connexion.findOne({user:player.user}).exec(function(err, connexion){
            if(connexion){
              sails.sockets.emit(connexion.socket_id,'notif',actu);
            }
            callback2();
          });
        });
      },function(err){

      });
       callback();
     });
    }, function(err){
    });
  });
}


};
