var moment = require('moment');
var twilio = require('twilio');

module.exports = {

	mailConfirm : function(resa,callback){
		Field.findOne({id: resa.field},function(err,field){
	  		sails.hooks.email.send(
    			"Reservation",
    			{
      				recipientName: field.name,
      				senderName: "Wefoot",
      				resa : resa,
      				resaDate:moment(resa.date).locale('fr').format('LLLL')
    			},
    		{
      			to: field.mail.toString(),
      			subject: "WeFoot : Notification de reservation"
    		},
    		function(err){
    			if(err)
    				console.log('Error contacting'+ field.name +err);
    			else
    				callback(field);
    		});
    	});
	},

	smsConfirm : function(resa,field){
		var accountSid = "AC08f1dc44e7932781b9707802715e5acc"; //Test credentials
		var authToken = "6b926a5252b73e5434daa0dba74f2c7e";
		//var accountSid = 'ACeeccc993978862937acf0ece1380fd65';
		//var authToken = '9cef3cae41fd2ae906fcc24b6c664f4b';
		var client = twilio(accountSid,authToken);
		client.sms.messages.create({
    		body: "All in the game, yo",
    		to: "+33660957497",
    		from: "+15005550006"
		},function(err,message){
			if(err) console.log(err);
			else process.stdout.write(message.sid);
		});
	}
}