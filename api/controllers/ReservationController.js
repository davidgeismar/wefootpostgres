/**
 * ReservationController
 *
 * @description :: Server-side logic for managing reservations
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

var moment = require('moment');

module.exports = {

	getTerrainsFree: function(req,res){
		var resa = {date: req.param('date'), indoor: req.param('indoor'), field: req.param('field')};
		try{
			ResaService[req.param('api_ref')](resa,function(terrain){
				res.status(200).json(terrain);
			});
		}
		catch(e){
			console.log(e);
			return res.status(400).end();
		}
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

	// getTerrainsFreeHours: function (req, res, next){
	// 	var premiers = [2,3,5,7,11,13,17];
	// 	var datePremier = new Date(req.param('date'));
	// 	datePremier = premiers[datePremier.getDay()];

	// 	Terrain.find({field: req.param('field') , indoor: req.param('indoor') }, function foundTerrain (err, terrain) {
	// 		if(err) return res.status(400).end();
	// 		var terrainId = _.pluck(terrain,'id');
	   

	// 	Reservation.find({terrain: terrainId , 
	// 		date : moment(req.param('date')).add(req.param('vari'),'Hours').format()},
	// 		function foundReservation (err, reservation) {
	// 		if(err) return res.status(400).end(); 
	// 		var reservationTerrain = _.pluck(reservation,'terrain');

	// 		var Terrainsfree = _.reject(terrain,function(terr){
	// 			return _.contains(reservationTerrain, terr.id); 
	// 		});


	// 		if(Terrainsfree.length!=0){
	// 			Promotion.find({terrain: Terrainsfree[0].id}, function foundPromotions (err, promotions) {
	// 				if(err) return res.status(400).end();

	// 	    		var PromoDay = _.reject(promotions,function(reservation){
	// 					return reservation.repetitions % datePremier != 0; 
	// 				});

	// 				var dateJJ = new Date(req.param('date'));

	// 				var PromoDayTerr = _.reject(PromoDay,function(reservation){
	// 					return( (reservation.heureDebut > dateJJ) && (reservation.heureDebut < dateJJ)); 
	// 				});

	// 				var promotion = PromoDayTerr[0];
	// 				if(promotion){
	// 					Terrainsfree[0].prix = promotion.promo*Terrainsfree[0].prix;
	// 				}else{
	// 					Terrainsfree[0].prix =1 *Terrainsfree[0].prix;
	// 				}
			
	// 				var rep = [req.param('vari') , Terrainsfree[0]];
	// 				res.status(200).json(rep);
	// 			});

	// 		}else{
	// 			res.status(200).end();
	// 		}
			
	// 	});

	// 	});

	// },

	create: function (req,res,next){
		try{
			ResaService[req.param('api_ref')+'_create'](req.params.all(),function(resa){
				res.status(200).json(resa);
			});
		}
		catch(e){
			console.log(e);
			res.status(400).end();
		}
	}

};
