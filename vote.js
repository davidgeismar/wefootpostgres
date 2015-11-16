#! /app/bin/node

var async = require('async');
var moment = require('moment');


/**
 * app.js
 *
 * Use `app.js` to run your app without `sails lift`.
 * To start the server, run: `node app.js`.
 *
 * This is handy in situations where the sails CLI is not relevant or useful.
 *
 * For example:
 *   => `node app.js`
 *   => `forever start app.js`
 *   => `node debug app.js`
 *   => `modulus deploy`
 *   => `heroku scale`
 *
 *
 * The same command-line arguments are supported, e.g.:
 * `node app.js --silent --port=80 --prod`
 */

// Ensure we're in the project directory, so relative paths work as expected
// no matter where we actually lift from.
process.chdir(__dirname);

// Ensure a "sails" can be located:
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

  // Try to get `rc` dependency
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
	function vote() {
		var nowMinus4h = moment().subtract(4, 'hours').format();
		var nowMinus8h = moment().subtract(8, 'hours').format();
		Foot.find({ date: { '<': nowMinus8h, '>': nowMinus4h }}).exec(function(err, foots){
			async.each(foots, function(foot, callback){
				Player.find({foot:foot.id, or: [{statut:2},{statut:3}]}).exec(function(err, players){
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
	}


  // Start server
  sails.lift(rc('sails'));
  
  vote();
})();
process.exit();