/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#!/documentation/reference/sails.config/sails.config.bootstrap.html
 */

 module.exports.bootstrap = function(cb) {

 	sails.on('lifted', function() {
 		PushService.sendPush(["2d5d19b762e9e426bf99043b77966cfa14e66715ea59b31ba6cd87a0311a8ce8"]);
 		// console.log('sockets destroyed');
 		Connexion.query('TRUNCATE TABLE connexion');
 	});

 	cb();
 };
