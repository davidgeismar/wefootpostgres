module.exports = {

  sendAndroidPush: function(text, tokens,additionalData){
    var gcm = require('node-gcm');
    var sender = new gcm.Sender('AIzaSyD4wa4B3NBNKaKIPr8Mykh9Q_eA4BIObCI');
    var message = new gcm.Message({
    collapseKey: 'demo',
    priority: 'high',
    contentAvailable: true,
    delayWhileIdle: true,
    timeToLive: 3,
    data: additionalData,
    notification: {
        title: "WeFoot, le Football connecté",
        icon: "icon",
        body: text
   }
});

sender.send(message, tokens, function (err, result) {
  if(err) console.log(err);
});
},

sendIosPush: function(text, tokens, pendingNotifs, additionalData){
  var apn = require('apn');
  var note = new apn.Notification();
  note.badge = pendingNotifs;
  note.contentAvailable = 1;
  note.sound = "ping.aiff";
  note.alert = {
    body : text
  };
  note.payload = additionalData;


  var options = {
    gateway: 'gateway.push.apple.com',
    errorCallback: function(error){
      console.log('push error', error);
    },
    cert: 'PushNewsCert.pem',
    key:  'PushNewsKey.pem',
    passphrase: 'lemonde',
    production: true,
    port: 2195,
    enhanced: true,
    cacheLength: 100
  };

  var apnsConnection = new apn.Connection(options);
  apnsConnection.pushNotification(note, tokens);

  apnsConnection.on('transmissionError', function(errCode, notification, device) {
    console.error("Notification caused error: " + errCode + " for device ", device, notification);
  });

  apnsConnection.on('disconnected', function() {
    console.log("Disconnected from APNS");
  });

  apnsConnection.on('socketError', console.error);

},

sendPush:function(pushes, pushText, additionalData){
  var userPushes = [];
  var androidPushes = [];
  var iosPushes = [];
  User.find(_.pluck(pushes,'user'),function(err,users){
    if(err){console.log(err); return res.status(400).end();}
    if(users.length>0){
      users.forEach(function(user){
        userPushes = _.filter(pushes, function(push){return push.user == user.id});
        user.pending_notif++;
        user.save();
        androidPushes = _.pluck(_.filter(userPushes, function(push){ return !push.is_ios}), 'push_id');
        iosPushes =  _.pluck(_.filter(userPushes, function(push){ return push.is_ios}), 'push_id');
        if(androidPushes.length!=0){
          PushService.sendAndroidPush(pushText, androidPushes,additionalData);
        }
        if(iosPushes.length!=0){
          PushService.sendIosPush(pushText, iosPushes, user.pending_notif,additionalData);
        }
      });
    }
});
}

};