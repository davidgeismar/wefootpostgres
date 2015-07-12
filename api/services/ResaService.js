var moment = require('moment');

module.exports = {



	getPrix : function(terrain,date,callback){
		var premiers = [2,3,5,7,11,13,17];
		var datePremier = new Date(date);
		datePremier = premiers[datePremier.getDay()]; //Match a primary number with a day of the week
		Promotion.find({terrain: terrain.id}, function foundPromotions (err, promotions) {
			if(err) throw err;
			var PromoDay = _.reject(promotions,function(reservation){
				return reservation.repetitions % datePremier != 0; 
			});

			var dateJJ = new Date(date);
			var PromoDayTerr = _.reject(PromoDay,function(reservation){
				return( (reservation.heureDebut > dateJJ) && (reservation.heureDebut < dateJJ)); 
			});

			var promotion = PromoDayTerr[0];
			// console.log(terrain);
			if(promotion)
				callback(promotion.promo*terrain.prix);
			else
				callback(terrain.prix);
			return;
		});		

	},

	classic : function (resa,callback) {
		Terrain.find({field: resa.field,  indoor: resa.indoor }, function foundTerrain (err, terrain) {
			if(err) throw err;
			var terrainId = _.pluck(terrain,'id');
			var dateSup = moment(resa.date).add(1,'Hours').format();
			var dateInf = moment(resa.date).add(-1,'Hours').format();//Check not passed
			Reservation.find({terrain: terrainId, date: {'>': dateInf, '<': dateSup}}, function foundReservation (err, reservation) {
				if(err) throw err;
				var reservationTerrain = _.pluck(reservation,'terrain');
				var terrainsFree = _.reject(terrain,function(num){ 
					return _.contains(reservationTerrain, num.id); 
				});
				if(terrainsFree.length>0){
					console.log(terrainsFree[0]);
					var prix = ResaService.getPrix(terrainsFree[0],resa.date,function(prix){
						terrainsFree[0].prix = prix;
						callback(terrainsFree[0]);
						return;
					});
				}
				else{ callback(false); return }; //Not available field
			});
		});
	}
}