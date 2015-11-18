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

    function threehoursbefore() {
      var nowMinus3h10min = moment().subtract(3, 'hours').subtract(10, 'minutes').format();
      var nowMinus3h = moment().subtract(3, 'hours').format();
      Foot.find({ date: { '>': nowMinus3h10min, '<': nowMinus3h }}).exec(function(err, foots){
        if(err)
          console.log(err);
        async.each(foots, function(foot, callback){
          Player.find({foot:foot.id}).exec(function(err, players){
        //We send pushes
        var usersId = _.pluck(players, 'user');
        Push.find({user:usersId}).exec(function(err, pushes){
          if(pushes){
            PushService.sendPush(pushes, "Votre rencontre démarre dans 3h, ne soyez pas en retard");
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
        callback();
      });

     });
        },function(err){
          process.exit();
        });
});
}
threehoursbefore();
});
})();
