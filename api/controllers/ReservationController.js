/**
 * ReservationController
 *
 * @description :: Server-side logic for managing reservations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');
var credentials = {}; //Store temp infos for google cal
module.exports = {

	getTerrainsFree: function(req,res){
		var resa = {duree: req.param('duree'), date: moment(req.param('date')).format(), date_fin:moment(req.param('date')).add(req.param('duree'), 'minutes').format(), indoor: req.param('indoor'), field: req.param('field'), student_discount:req.param('student_discount')};
			ResaService[req.param('api_ref')](resa,function(terrain){
				if(terrain === 0) return res.status(400).end();
				res.status(200).json(terrain);
			});
	},

// 	getTerrainsFreeField: function (req, res, next){
// 		var premiers = [2,3,5,7,11,13,17];
// 		var datePremier = new Date(req.param('date'));
// 		datePremier = premiers[datePremier.getDay()];

// 		Terrain.find({ field: { 'not' : req.param('field')}, indoor: req.param('indoor') }).exec(function foundTerrain (err, terrain) {
// 			if(err){	
// 				return res.status(400).end();
// 			}
// 			var terrainId = _.pluck(terrain,'id');
// 			var terrainField = _.pluck(terrain,'field');

// 			Reservation.find({terrain: terrainId , date: req.param('date')}, function foundReservation (err, reservation) {
// 				if(err) return res.status(400).end(); 
// 				var reservationTerrain = _.pluck(reservation,'terrain');

// 				var Terrainsfreefield = _.reject(terrainId,function(num){ 
// 					return _.contains(reservationTerrain, num); 
// 				});


// 				var listeterrainfield = _.filter(terrain, function(num){
// 					return _.contains(Terrainsfreefield, num.id);
// 				})

// 				var listeFieldUnic = _.uniq(listeterrainfield, 'field');
// 				var idsss = _.pluck(listeFieldUnic,'field');

// 				Field.find({id: idsss}, function foundField (err, field) {
// 					if(err){
// 						return res.status(400).end();
// 					}
// 					var nameField = _.pluck(field,'name');

// 					if(listeFieldUnic.length!=0){
// 						async.each(listeFieldUnic, function(field,callback){
// 							Promotion.find({terrain: field.id}, function foundPromotions (err, promotions) {
// 								if(err) return res.status(400).end();

// 								var PromoDay = _.reject(promotions,function(reservation){
// 									return reservation.repetitions % datePremier != 0; 
// 								});

// 								var dateJJ = new Date(req.param('date'));

// 								var PromoDayTerr = _.reject(PromoDay,function(reservation){
// 									return( (reservation.heureDebut > dateJJ) && (reservation.heureDebut < dateJJ)); 
// 								});
// 								var promotion = PromoDayTerr[0];
// 								if(promotion){
// 									field.prix = promotion.promo*field.prix;
// 								}else{
// 									field.prix = 1*field.prix;
// 								}
// 								callback();
// 							});
// },function(){
// 	var answer = [nameField,listeFieldUnic];
// 	res.status(200).json(answer);
// });
// }else{
// 	res.status(200).end();
// }
// });

// }); 

// });

// },

	create: function (req,res){
			ResaService.classic_create(req.params.all(),function(resa){
				if(resa === 0) return res.status(400).end();
				if(req.param('api_ref')!='classic'){
					ResaService[req.param('api_ref')+'_create'](req.params.all(),function(resa){
						if(resa===0) res.status(400).end();
						res.status(200).json(resa);
					});
				}
				else res.status(200).json(resa);
			});
	},

	google_calendar_getAuth: function(req,res){
		if(req.param('secret')!='wfGenius1230')
			return res.status(400).end();
		ResaService.google_calendar_registration_getAuthUrl(req.param('name'),function(authUrl,oauth2){
			if(authUrl===0) return res.status(400).end();
			credentials.oauth2 = oauth2;
			res.status(200).send(authUrl);
			setTimeout(function(){
				credentials.oauth2 = "";
			},60000);
		});
	},

	google_calendar_getToken: function(req,res){
		if(req.param('secret')!='wfGenius1230')
			return res.status(400).end();
		ResaService.google_calendar_registration_getToken(credentials.oauth2,req.param('code'), req.param('name'), function(result){
			if(result === 0) return res.status(400).send('ERROR');
			if(result === 1) return res.status(400).send('Too long try again');
			res.status(200).send('success');
		});
	},

	// test: function(req,res){
	// 	ContactService.smsConfirm(0,0);
	// 	res.status(200).end();
	// },
	// testInfo: function(req,res){
	// 	var accountSid = "AC08f1dc44e7932781b9707802715e5acc"; //Test credentials
	// 	var authToken = "6b926a5252b73e5434daa0dba74f2c7e";
	// 	var client = require('twilio')(accountSid,authToken);
	// 	client.sms.messages("SMae7f267c606c438cb96d99099371a748").get(function(err, sms) {
 //    		console.log(err);
 //    		console.log(sms);
	// 	});
	// }

};
