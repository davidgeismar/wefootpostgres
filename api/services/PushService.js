//Handle HTTP REQ 
// var urllib = require('urllib');

// var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
// // IONIC CONFIGS
// var app_id = "82c453c4";
// var private_key = "12a08671f72fdd97aa5f603a399b7c9c6a358704d8e88cbc";
// var url = "https://push.ionic.io/api/v1/push";

// var b64 = Base64.encode(private_key).replace('\n', '');

module.exports = {



//TODO : Décliner cette méthode en fonction des types de push (ou ajouter des paramètres)
sendPush: function(tokens){


var ionicPushServer = require('ionic-push-server');
 
var credentials = {
    IonicApplicationID : "82c453c4",
    IonicApplicationAPIsecret : "12a08671f72fdd97aa5f603a399b7c9c6a358704d8e88cbc"
};
 
var notification = {
  "tokens":["1b4d1a8ba6b24cf15871e6481b108cc91cf397afa04ecf29e78a7236cc11edc0"],
  "notification":{
    "alert":"Ionic sucks!",
    "ios":{
      "badge":1,
      "sound":"chime.aiff",
      "expiry": 1423238641,
      "priority": 10,
      "contentAvailable": true,
      "payload":{
        "key1":"value",
        "key2":"value"
      }
    }
  } 
};

ionicPushServer(credentials, notification);
// 	var pushData =	{

// 		"tokens":["1b4d1a8ba6b24cf15871e6481b108cc91cf397afa04ecf29e78a7236cc11edc0"],
// 		"notification":{
// 			"alert":"Hello World!",
// 			"ios":{
// 				//NOTIFICATION SUR L'APP
// 				// "badge":3,
// 				// "sound":"ping.aiff",
// 				// "expiry": 1423238641,
// 				// "priority": 10,
// 				// "contentAvailable": true,
// 				"payload":{
// 					"key1":"value1"
// 					// ,
// 					// "key2":"value2"
// 				}
// 			},
// 			"android":{
// 				// "collapseKey":"foo",
// 				// "delayWhileIdle":true,
// 				// "timeToLive":300,
// 				"payload":{
// 					"key1":"value1"
// 					// ,
// 					// "key2":"value2"
// 				}
// 			}
// 		}
// 	};




// 	options = {
// 		"method": 'POST',
// 		"headers" : {
// 			"Content-type" :"application/json",
// 			"X-Ionic-Application-Id" : app_id,
// 			"Authorization" : "Basic "+b64
// 		},
// 		"data": pushData	
// 	};

// 	console.log(options);

// 	urllib.request(url, options, function(err, data, res){
// 		if(err){
// 			console.log("err");
// 			console.log(err);
// 		}

// 		console.log(data);
// 		console.log(res);


// 	});

}

};