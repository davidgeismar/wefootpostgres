//Handle HTTP REQ 
var urllib = require('urllib');

// var base64 = require('./base64.js').Base64;
// IONIC CONFIGS
var app_id = "82c453c4";
var private_key = "12a08671f72fdd97aa5f603a399b7c9c6a358704d8e88cbc";
var url = "https://push.ionic.io/api/v1/push";

// var b64 = base64.encode(private_key).replace('\n', '');

module.exports = {



//TODO : Décliner cette méthode en fonction des types de push (ou ajouter des paramètres)
sendPush: function(tokens){


	var pushData =	{
		"tokens":tokens,
		"notification":{
			"alert":"Hello World!",
			"ios":{
				"badge":1,
				"sound":"ping.aiff",
				"expiry": 1423238641,
				"priority": 10,
				"contentAvailable": true,
				"payload":{
					"key1":"value",
					"key2":"value"
				}
			},
			"android":{
				"collapseKey":"foo",
				"delayWhileIdle":true,
				"timeToLive":300,
				"payload":{
					"key1":"value",
					"key2":"value"
				}
			}
		}
	};



	options = {
		method: 'POST',
		headers : {
			"Content-type" :"application/json",
			"X-Ionic-Application-Id" : app_id,
			"Authorization" : "Basic "
			// +b64
		},
		data:pushData
	};

	urllib.request(url, options, function(err, data, res){
		if(err){
			console.log(err);
		}


	});

}

};