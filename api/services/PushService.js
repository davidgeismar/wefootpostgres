module.exports = {

  sendAndroidPush: function(text, tokens){
    var gcm = require('node-gcm');
    var sender = new gcm.Sender('AIzaSyD4wa4B3NBNKaKIPr8Mykh9Q_eA4BIObCI');
    var message = new gcm.Message({
      collapseKey: 'demo',
      delayWhileIdle: true,
      timeToLive: 3,
      data: {
        key1: text
        // ,
        // key2: 'message2'
      }
    });

//Now the sender can be used to send messages 
sender.send(message, tokens, function (err, result) {
  if(err) console.error(err);
  else    console.log(result);
});
},

sendIosPush: function(text, tokens, pendingNotifs){
  var apn = require('apn');
  var note = new apn.Notification();
  note.badge = pendingNotifs;
  note.contentAvailable = 1;
  note.sound = "ping.aiff";
  note.alert = {
    body : text
  };

  // note.device = device;
  var options = {
    gateway: 'gateway.sandbox.push.apple.com',
    errorCallback: function(error){
      console.log('push error', error);
    },
    cert: 'PushNewsCert.pem',
    key:  'PushNewsKey.pem',
    passphrase: 'lemonde',
    port: 2195,
    enhanced: true,
    cacheLength: 100
  };

  var apnsConnection = new apn.Connection(options);
  apnsConnection.pushNotification(note, tokens);

}

};