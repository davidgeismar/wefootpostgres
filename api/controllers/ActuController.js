/**
 * ActuController
 *
 * @description :: Server-side logic for managing actus
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {



 	testi: function(req,res){
 		var geocoderProvider = 'google';
 		var httpAdapter = 'https';
// optionnal
var extra = {
    apiKey: 'AIzaSyCwDEs1V_woC81ZRweT8uKCvgWOqICR_9M', // for Mapquest, OpenCage, Google Premier
    formatter: null         // 'gpx', 'string', ...
};

var geocoder = require('node-geocoder')(geocoderProvider, httpAdapter, extra);
var lati = [
{
	lat:48.834059,
	lon:2.572407
},
{
	lat:48.922138,
	lon:2.306813
}
,
{
	lat:48.907328,
	lon:2.37563
},
{
	lat:48.883704,
	lon:2.231202
},
{
	lat:48.800038,
	lon:2.21426
},
{
	lat:48.710761,
	lon:2.176419
},
{
	lat:48.901936,
	lon:2.431629
},
{
	lat:48.764926,
	lon:2.470982
},
{
	lat:48.896021,
	lon:2.36442
},
{
	lat:48.907001,
	lon:2.386172
},
{
	lat:49.045572,
	lon:2.078884
},
{
	lat:48.735941,
	lon:2.31539
},
{
	lat:48.950156,
	lon:2.209326
},
{
	lat:43.5011,
	lon:-1.483386
},
{
	lat:44.832295,
	lon:-0.545276
},
{
	lat:45.684165,
	lon:4.769618
},
{
	lat:49.016692,
	lon:2.181198
},
{
	lat:48.761833,
	lon:2.49795
},
{
	lat:49.055071,
	lon:2.034936
},
{
	lat:48.801799,
	lon:2.29307
},
{
	lat:49.003853,
	lon:2.279536
}
,
{
	lat:48.955311,
	lon:2.333369
},
{
	lat:48.75757,
	lon:1.921767
},
{
	lat:48.848564,
	lon:2.253038
},
{
	lat:48.972414,
	lon:2.918651
}
// ,
// {
// 	lat:48.624754,
// 	lon:2.335649
// },
// {
// 	lat:49.898696,
// 	lon:2.341234
// },
// {
// 	lat:48.734201,
// 	lon:2.323901
// },
// {
// 	lat:47.356673,
// 	lon:5.043876
// },
// {
// 	lat:48.705016,
// 	lon:2.296857
// },
// {
// 	lat:48.918935,
// 	lon:2.212094
// },
// {
// 	lat:50.579304,
// 	lon:3.115615
// },
// {
// 	lat:50.429068,
// 	lon:2.743262
// },
// {
// 	lat:49.427041,
// 	lon:1.052127
// },
// {
// 	lat:49.193821,
// 	lon:-0.449225
// },
// {
// 	lat:47.903415,
// 	lon:1.887488
// },
// {
// 	lat:47.432531,
// 	lon:0.692808
// },
// {
// 	lat:47.254838,
// 	lon:-1.656438
// },
// {
// 	lat:48.424862,
// 	lon:-4.470033
// },
// {
// 	lat:44.040908,
// 	lon:1.370673
// },
// {
// 	lat:43.634681,
// 	lon:1.492025
// },
// {
// 	lat:42.685171,
// 	lon:2.853684
// },
// {
// 	lat:43.59172,
// 	lon:3.903113
// },
// {
// 	lat:43.689619,
// 	lon:4.15804
// },
// {
// 	lat:43.932888,
// 	lon:4.788603
// },
// {
// 	lat:43.426301,
// 	lon:5.245512
// },
// {
// 	lat:43.249749,
// 	lon:5.547211
// },
// {
// 	lat:48.586498,
// 	lon:2.595764
// },
// {
// 	lat:48.953922,
// 	lon:2.914853
// },
// {
// 	lat:43.479121,
// 	lon:5.396497
// },
// {
// 	lat:45.707929,
// 	lon:4.929366
// },
// {
// 	lat:48.772471,
// 	lon:2.058514
// },
// {
// 	lat:48.899474,
// 	lon:2.221651
// },
// {
// 	lat:50.690413,
// 	lon:3.085538
// },
// {
// 	lat:48.826441,
// 	lon:2.629277
// },
// {
// 	lat:47.1890131,
// 	lon:-1.5080382
// },
// {
// 	lat:48.075935,
// 	lon:-1.601235
// },
// {
// 	lat:43.658605,
// 	lon:7.094559
// },
// {
// 	lat:48.200214,
// 	lon:-1.723061
// },
// {
// 	lat:44.77957,
// 	lon:-0.643925
// },
// {
// 	lat:44.841743,
// 	lon:-0.682542
// },
// {
// 	lat:45.754752,
// 	lon:3.13638
// },
// {
// 	lat:45.823549,
// 	lon:4.994594
// },
// {
// 	lat:45.712298,
// 	lon:4.90384
// },
// {
// 	lat:43.628336,
// 	lon:3.911745
// },
// {
// 	lat:45.460628,
// 	lon:4.392797
// },
// {
// 	lat:43.574822,
// 	lon:1.480017
// },
// {
// 	lat:48.419618,
// 	lon:-4.414503
// },
// {
// 	lat:45.809004,
// 	lon:1.257177
// },
// {
// 	lat:45.204007,
// 	lon:5.773256
// },
// {
// 	lat:50.616157,
// 	lon:3.100094
// },
// {
// 	lat:47.340222,
// 	lon:5.072307
// },
// {
// 	lat:44.392409,
// 	lon:0.719764
// },
// {
// 	lat:45.456129,
// 	lon:4.397537
// },
// {
// 	lat:44.591617,
// 	lon:4.437072
// },
// {
// 	lat:48.762834,
// 	lon:1.912331
// },
// {
// 	lat:43.432431,
// 	lon:5.396958
// },
// {
// 	lat:46.114643,
// 	lon:3.436505
// },
// {
// 	lat:45.815475,
// 	lon:4.876711
// },
// {
// 	lat:45.684975,
// 	lon:4.829901
// },
// {
// 	lat:46.299859,
// 	lon:-0.497032
// },
// {
// 	lat:44.86544,
// 	lon:-0.477925
// },
// {
// 	lat:43.671884,
// 	lon:1.410407
// },
// {
// 	lat:43.273553,
// 	lon:5.638422
// },
// {
// 	lat:43.611751,
// 	lon:7.122251
// },
// {
// 	lat:47.079281,
// 	lon:2.358206
// },
// {
// 	lat:44.787248,
// 	lon:-0.590456
// },
// {
// 	lat:47.471013,
// 	lon:-0.524964
// },
// {
// 	lat:47.814645,
// 	lon:-0.708316
// },
// {
// 	lat:48.545187,
// 	lon:-2.778606
// },
// {
// 	lat:46.206985,
// 	lon:6.27996
// },
// {
// 	lat:45.676873,
// 	lon:4.941557
// },
// {
// 	lat:48.946337,
// 	lon:2.023018
// },
// {
// 	lat:48.819434,
// 	lon:2.525267
// },
// {
// 	lat:49.143012,
// 	lon:6.176573
// },
// {
// 	lat:47.940494,
// 	lon:1.937101
// },
// {
// 	lat:43.3043,
// 	lon:-0.317999
// },
// {
// 	lat:47.353489,
// 	lon:0.673939
// },
// {
// 	lat:43.7182633,
// 	lon:7.2032701
// },
// {
// 	lat:49.066906,
// 	lon:1.172397
// }
];
var finale = [];

lati.forEach(function(lato){
	geocoder.reverse(lato, function(err, res) {
		console.log(res);
		finale.push(res);
		if(finale.length == lati.length){
			return res.json(finale);
		}
	});
})
},
getNotif: function(req,res){
	Actu.find().where({user: req.param('id')}).exec(function(err,actus){
		if(err) return res.status(400).end();
		res.json(actus);
	});
},
getActu: function(req,res){
	var moment = require('moment');
	console.log(req.param('skip'));
	Actu.find({where: { or:[{related_user: req.param('friends'),typ:['footConfirm','newFriend','demandAccepted']},
		{user:req.param('friends'),typ:['hommeDuMatch','chevreDuMatch','newFriend']}], id: {'>': req.param('skip')}}
		,sort:'createdAt DESC',limit:30},function(err,actu){
			console.log(actu);
			var notMine = _.filter(actu,function(elem){return elem.user!=req.param('user')&&elem.related_user != req.param('user')});
			var result = _.groupBy(notMine, function(elem){return moment(elem.createdAt).lang('fr').format('L')});
			res.status(200).json(result);
		});
},
newNotif: function(req,res){
	Actu.create(req.params.all(),function(err,actu){
		if(err) return res.status(400).end();
		Connexion.find().where({user: req.param('user')}).exec(function(err,connexions){
			if(err) return res.status(400).end();
				if(!connexions[0]) return res.status(200).end(); // Si l'utlisateur n'est pas connecté on envoi rien.
				_.each(connexions,function(connexion){
					sails.sockets.emit(connexion.socket_id,'notif',actu);   // Envoi un évènement socket.
				});
				res.status(200).end();
			});
	});
}

	// footInvit: function(req,res){
	// 	var toFinish = 0;
	// 	var related;
	// 	if(req.param('from'))
	// 		related = req.param('from');
	// 	else
	// 		related = req.param('created_by');
	// 	async.each(req.param('toInvite'),function(player,callback){
	// 		Actu.create({user: player, related_user: related, typ: 'footInvit', related_stuff: req.param('id')},function(err,actu){
	// 			if(err) return res.status(400).end();
	// 			Connexion.find().where({user : player}).exec(function(err,connexions){
	// 				if(err) return res.status(400).end();
	// 				if(connexions[0]){   //On verifie que l'utilsateur est connecté, (pas de return car on est dans une boucle).
	// 					_.each(connexions,function(connexion,index){
	// 							sails.sockets.emit(connexion.socket_id,'notif',actu);   // Envoi un évènement socket.
	// 							if(index==connexions.length-1)
	// 								callback();
	// 					});
	// 				}	
	// 				else callback();
	// 			});
	// 		});
	// 	},function(){
	// 		return res.status(200).end();
	// 	});
	// }


};

