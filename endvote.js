#! /app/bin/node

var async = require('async');
var moment = require('moment');


process.chdir(__dirname);

(function() {
  var sails;
  try {
    sails = require('sails');
  } catch (e) {
    console.error('To run an app using `node app.js`, you usually need to have a version of `sails` installed in the same directory as your app.');
    console.error('To do that, run `npm install sails`');
    console.error('');
    console.error('Alternatively, if you have sails installed globally (i.e. you did `npm install -g sails`), you can use `sails lift`.');
    console.error('When you run `sails lift`, your app will still use a local `./node_modules/sails` dependency if it exists,');
    console.error('but if it doesn\'t, the app will run with the global sails instead!');
    return;
  }

  var rc;
  try {
    rc = require('rc');
  } catch (e0) {
    try {
      rc = require('sails/node_modules/rc');
    } catch (e1) {
      console.error('Could not find dependency: `rc`.');
      console.error('Your `.sailsrc` file(s) will be ignored.');
      console.error('To resolve this, run:');
      console.error('npm install rc --save');
      rc = function () { return {}; };
    }
  }


  // Start server
  sails.lift(rc('sails'), function(){

    function endvote() {
     var nowMinus3d = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
     var nowMinus4d = moment().subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss');
     var finish = 0;
      // On sélectionne les chevres et hommes des foots qui ont plus de 3 jours     
      Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot WHERE v.chevre IS NOT NULL and f.date < '"+nowMinus3d+"' and f.date > '"+nowMinus4d+"' group by v.chevre, v.foot) x group by foot, chevre",function(err,results){
        if(results){
          var results = results.rows;
          console.log(results);
          async.each(results, function(result, callback){
            Trophe.create({foot:result.foot, trophe:0, user:result.chevre}).exec(function(err,tr){
              console.log(err);
            });
            Actu.create({user:result.chevre, related_user:result.chevre, typ:'chevreDuMatch', related_stuff:result.foot}).exec(function(err,actu){
              if(err)
                console.log(err);
              Connexion.findOne({user:result.chevre}).exec(function(err, connexion){
                if(connexion){
                  sails.sockets.emit(connexion.socket_id,'notif',actu);
                  callback();
                }

                else{
                  callback();
                }
              });

            });

          }, function(err){
            finish++;
            if(finish==2)
              process.exit();
          });
        }
      });

Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot WHERE v.homme IS NOT NULL and f.date < '"+nowMinus3d+"' and f.date > '"+nowMinus4d+"' group by v.homme, v.foot) x group by foot, homme",function(err,results){
 if(results){
  var results = results.rows;
  console.log(results);
  async.each(results, function(result, callback){
    Trophe.create({foot:result.foot, trophe:1, user:result.homme});
    Actu.create({user:result.homme, related_user:result.homme, typ:'hommeDuMatch', related_stuff:result.foot}).exec(function(err,actu){
      if(err)
        console.log(err);
      Connexion.findOne({user:result.homme}).exec(function(err, connexion){
        if(connexion){
          sails.sockets.emit(connexion.socket_id,'notif',actu);
          callback();
        }
        else
          callback();
      });

    });

  }, function(err){
    finish++;
    if(finish==2)
      process.exit();
  });
}
});
}
endvote();
});
})();
// process.exit();