/**
 * Created by jaumard on 27/02/2015.
 */
 var async = require('async');

 module.exports.schedule = {

      //Check end election
      //Everyday at 2:30AM
      "30 2 * * *"   : function ()
      {
      	var nowMinus3d = new Date();
      	nowMinus3d.setDate(nowMinus3d.getDate()-3);
      	var nowMinus4d = new Date();
      	nowMinus4d.setDate(nowMinus4d.getDate()-4);

          // On sélectionne les gagnants des foots qui ont plus de 3 jours et qui ne sont terminés  		
          Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot group by v.chevre, v.foot where f.date <"+nowMinus3d+" and f.date > "+nowMinus4d+") x group by foot",function(err,results){
          	async.each(results, function(result, callback){
          		Trophe.create({foot:result.foot, trophe:0, user:result.chevre, nbVotes:result.maxVotes});

              Actu.create({user:result.chevre, related_user:result.chevre, typ:'chevreDuMatch', related_stuff:foot.id}).exec(function(err,actu){
                if(err)
                  console.log(err);
                Connexion.findOne({user:result.chevre}).exec(function(err, connexion){
                  if(connexion){
                    sails.sockets.emit(connexion.socketId,'notif',actu);
                  }
                });

              });
              callback();
            }, function(err){
            });

          });

          Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot group by v.homme, v.foot where f.date <"+nowMinus3d+" and f.date > "+nowMinus4d+") x group by foot",function(err,results){
          	async.each(results, function(result, callback){
          		Trophe.create({foot:result.foot, trophe:1, user:result.homme, nbVotes:result.maxVotes});
              Actu.create({user:result.homme, related_user:result.homme, typ:'hommeDuMatch', related_stuff:foot.id}).exec(function(err,actu){
                if(err)
                  console.log(err);
                Connexion.findOne({user:result.homme}).exec(function(err, connexion){
                  if(connexion){
                    sails.sockets.emit(connexion.socketId,'notif',actu);
                  }
                });

              });
              callback();
            }, function(err){

            });

          });
        },

      //Check end foot, trigger vote for each player
      //Every 4 hours
      "* */4 * * *": function (){
        var nowMinus4h = new Date();
        nowMinus4h.setHours(nowMinus4h.getHours() - 4);
        var nowMinus8h = new Date();
        nowMinus8h.setHours(nowMinus8h.getHours() - 8);        
// { date: { '>': nowMinus8h, '<': nowMinus4h }}
Foot.find().exec(function(err, foots){
  async.each(foots, function(foot, callback){
    Player.find({foot:foot.id}).exec(function(err, players){
      async.each(players, function(player, callback2){
        Actu.create({user:player.user, related_user:foot.created_by, typ:'endGame', related_stuff:foot.id}).exec(function(err,actu){
          if(err)
            console.log(err);
          Connexion.findOne({user:player.user}).exec(function(err, connexion){
            if(connexion){
              sails.sockets.emit(connexion.socketId,'notif',actu);
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

}

};
