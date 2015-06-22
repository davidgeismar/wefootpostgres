//Handle HTTP REQ 
var urllib = require('urllib');

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9\+\/\=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/\r\n/g,"\n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}
// IONIC CONFIGS
var app_id = "82c453c4";
var private_key = "12a08671f72fdd97aa5f603a399b7c9c6a358704d8e88cbc:";
var url = "https://push.ionic.io/api/v1/push";

var b64 = Base64.encode(private_key).replace('\n', '');

module.exports = {



//TODO : Décliner cette méthode en fonction des types de push (ou ajouter des paramètres)
sendPush: function(tokens){


	var pushData =	{
		tokens:"DEV-5b33232d-8a65-4688-ba58-05a07d760ce8",
		notification:{
			alert:"Hello World!",
			ios:{
				//NOTIFICATION SUR L'APP
				badge:3,
				sound:"ping.aiff",
				expiry: 1423238641,
				priority: 10,
				contentAvailable: true,
				payload:{
					key1:"value",
					key2:"value"
				}
			},
			android:{
				collapseKey:"foo",
				delayWhileIdle:true,
				timeToLive:300,
				payload:{
					key1:"value",
					key2:"value"
				}
			}
		}
	};

// 	{
//   "tokens":[
//     "b284a6f7545368d2d3f753263e3e2f2b7795be5263ed7c95017f628730edeaad",
//     "d609f7cba82fdd0a568d5ada649cddc5ebb65f08e7fc72599d8d47390bfc0f20"
//   ],
//   "notification":{
//     "alert":"Hello World!",
//     "ios":{
//       "badge":1,
//       "sound":"ping.aiff",
//       "expiry": 1423238641,
//       "priority": 10,
//       "contentAvailable": true,
//       "payload":{
//         "key1":"value",
//         "key2":"value"
//       }
//     },
//     "android":{
//       "collapseKey":"foo",
//       "delayWhileIdle":true,
//       "timeToLive":300,
//       "payload":{
//         "key1":"value",
//         "key2":"value"
//       }
//     }
//   }
// }



	options = {
		method: 'POST',
		headers : {
			"Content-type" :"application/json",
			"X-Ionic-Application-Id" : app_id,
			"Authorization" : "Basic "+b64
		},
		data: pushData
	};

	console.log(options);

	urllib.request(url, options, function(err, data, res){
		if(err){
			console.log("err");
			console.log(err);
		}
		console.log(res);


	});

}

};