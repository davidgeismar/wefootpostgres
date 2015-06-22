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
 		PushService.sendPush("1b4d1a8ba6b24cf15871e6481b108cc91cf397afa04ecf29e78a7236cc11edc0");
 		// console.log('sockets destroyed');
 		Connexion.query('TRUNCATE TABLE connexion');
 	});

 	cb();
 };
