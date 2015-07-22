var moment = require('moment');
var fs = require('fs');
var google = require('googleapis');
var googleAuth = require('google-auth-library');
var path = require('path');

var resaService =  {


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
			if(err) callback(0);
			var terrainId = _.pluck(terrain,'id');
			var dateSup = moment(resa.date).add(1,'Hours').format();
			var dateInf = moment(resa.date).add(-1,'Hours').format();//Check not passed
			Reservation.find({terrain: terrainId, date: {'>': dateInf, '<': dateSup}}, function foundReservation (err, reservation) {
				if(err) callback(0);
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
	},

	classic_create: function(resa,callback){
		Reservation.create({date:resa.date,terrain:resa.terrain}, function reservationCreated(err,reservation){
			if(err) callback(0);
			else callback(reservation);
		});
	},


	google_calendar_authorize: function(name,callback1){
		var url = path.join(__dirname,'../../credentials/'+name+'_secret.json');
		var SCOPES = ['https://www.googleapis.com/auth/calendar'];

		fs.readFile(url, function(err,content){
			if(err) {console.log(err); return callback1(0); }
			authorize(JSON.parse(content),function(oauth2Client){callback1(oauth2Client)});
		});

		function authorize(credentials, callback) {
			var TOKEN_DIR = path.join(__dirname,'../../credentials');
			var TOKEN_PATH = TOKEN_DIR + '/' + name + '.json';
			var clientSecret = credentials.installed.client_secret;
			var clientId = credentials.installed.client_id;
			var redirectUrl = credentials.installed.redirect_uris[0];
			var auth = new googleAuth();
			var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
  			fs.readFile(TOKEN_PATH, function(err, token) {
  				if (err) {
  					callback(0);
  				} else {
  					oauth2Client.credentials = JSON.parse(token);
  					callback(oauth2Client);
  				}
  			});
		};

	},


	google_calendar_registration_getAuthUrl: function(name,callback){
			var url = path.join(__dirname,'../../credentials/'+name+'_secret.json');
			var SCOPES = ['https://www.googleapis.com/auth/calendar'];

			fs.readFile(url, function(err,content){
				if(err) callback(0);
				var credentials = JSON.parse(content);
				var clientSecret = credentials.installed.client_secret;
				var clientId = credentials.installed.client_id;
				var redirectUrl = credentials.installed.redirect_uris[0];
				var auth = new googleAuth();
				var oauth2Client = new auth.OAuth2(clientId, clientSecret, redirectUrl);
				var authUrl = oauth2Client.generateAuthUrl({
					access_type: 'offline',
					scope: SCOPES
				});
				callback(authUrl,oauth2Client);
			});
	},

	google_calendar_registration_getToken: function(oauth2Client,code,name,callback){
		var TOKEN_DIR = path.join(__dirname,'../../credentials');
		var TOKEN_PATH = TOKEN_DIR + '/' + name + '.json';
		if(!oauth2Client || oauth2Client.length==0)
			return callback(1);
		oauth2Client.getToken(code, function(err, token) {
			if(err){
				console.log(err);
				return callback(0);
			}
			oauth2Client.credentials = token;
			fs.writeFile(TOKEN_PATH, JSON.stringify(token));
			callback();
		});
	},

	google_calendar: function(resa,callback){
		Terrain.find({field: resa.field,  indoor: resa.indoor }, function foundTerrain (err, terrain) {
			resaService.google_calendar_authorize(resa.field,function(auth){
				if(auth===0) callback(0); 
				var calendar = google.calendar('v3');
				calendar.events.list({
					auth: auth,
					calendarId: 'primary',
					timeMin: new Date(resa.date).toISOString(),
 					timeMax: new Date((new Date(resa.date).getTime() + 60*60*1000)).toISOString(),
 					maxResults: 10,
 					singleEvents: true,
 					orderBy: 'startTime'
 				}, function(err, response) {
 					if (err) {
 						console.log('The API returned an error: ' + err);
 						return;
 					}
 					var events = response.items;
 					if (events.length < terrain.length) {
 						resaService.getPrix(terrain[0],resa.date,function(prix){
 							callback({terrain:terrain[0], prix: prix});
 						});
 					} else {
 						callback(false);
 					}
 				});
			});
		});
	},

	google_calendar_create: function(resa,callback){
		var calendar = google.calendar('v3');
		var event = {
			'start': {
    			'dateTime': resa.date
			},
			'end': {
				'dateTime': moment(resa.date).add(1,'Hours').format()
			},
			'summary': 'Reservation via Wefoot',
			'description': resa.userName +" "+ resa.userPhone
		}
		resaService.google_calendar_authorize(resa.field,function(auth){
			calendar.events.insert({
				auth: auth,
				calendarId: 'primary',
				resource: event
			},function(err,event){
				if(err){
					console.log('Error fetching event on Gcalendar'+ err);
					callback(0);
				}
				ContactService.mailConfirm(resa);
				callback();
			});
		});
	}
}
module.exports = resaService;