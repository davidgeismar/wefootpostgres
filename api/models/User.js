/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

var rand = function() {
  return Math.random().toString(36).substr(2); 
};

var token = function() {
  return rand() + rand(); 
};

var bcrypt = require('bcrypt');

module.exports = {


	types: {
   password:function(password){
    var bool = (password === this.password_confirmation);
    if(this.facebook_id==null){
      if(password.length<3){
        bool = false;
      }
    }
    return bool;
  }
},

beforeCreate: function (attrs, next) {


  bcrypt.genSalt(10, function(err, salt) {
    if (err) return next(err);
    if(attrs.password){
      console.log(attrs.password);
      bcrypt.hash(attrs.password, salt, function(err, hash) {
        console.log(hash);
        if (err) return next(err);
        attrs.password = hash;
        attrs.password_confirmation = hash;
        attrs.full_name = ToolsService.clean(attrs.first_name)+ToolsService.clean(attrs.last_name);
        next();
      });
    }
    else{
      attrs.full_name = ToolsService.clean(attrs.first_name)+ToolsService.clean(attrs.last_name);
      next();
    }   
  });
},


//permet de recrypter le MDP après modification






// afterCreate: function(attrs,next) {
//   var jwt = require('jsonwebtoken');
//   var tok = jwt.sign(attrs,'123Tarbahh');
//   attrs.token = tok;
//   attrs.save(function (err) {
//     if(err) return next(err);
//     next();
//   });
//   // User.update(attrs.id,{token:tok}).exec(function(error,user) {  
//   // });

// },

// afterUpdate: function(user,next) {
//   var jwt = require('jsonwebtoken');
//   var tok = jwt.sign(user,'123Tarbahh');
//   console.log(user.token);
//   user.token = tok;
//   user.save();
//   // User.update(attrs.id,{token:tok}).exec(function(error,user) {  
//   // });
//   next();
// },


attributes: {

 id: {
  type: 'int',
  primaryKey: true,
  autoIncrement: true
},
facebook_id: {
  type: 'int'
},
email: {
 type: 'string',
 unique:true,
 required: true
},
password:{
 type: 'string'
 // ,
 // password: true
},
password_confirmation:{
 type:'string'
},
token: {
  type:'string',
  size: 2000
},
first_name: {
  type: 'string',
  required: true
},
last_name: {
 type: 'string',
 required: true
},
full_name: {
  type: 'string'
},
poste: {
  type: 'string'
},
favorite_club: {
 type:'string'
},
picture: {
  type:'string',
  defaultsTo: 'https://wefoot.s3.amazonaws.com/default.svg'
},
birthday: {
  type: 'date'
},
mangoId: {
  type: 'integer'
},
telephone: {
  type: 'string'
},
password_reset_token:{
  type:'string'
},
last_seen:{   //Last opening of notif page
  type:'datetime'
},
pending_notif:{
  type:'int',
  defaultsTo: 0
},
nb_connection:{
  type:'int',
  defaultsTo: 0
},
last_lat:{
  type: 'float'
},
last_long:{
  type: 'float'
},

toJSON: function(){
  var obj= this.toObject();
  delete obj.password;
  delete obj.password_confirmation;
  delete obj.password_reset_token;
  return obj;
},

generatepassword_reset_token: function() {

  this.password_reset_token = token();
  this.save(function (err) {
    if(err) console.log(err);
  });
},

sendPasswordResetEmail: function() {
  var path = require('path');
  sails.config.email = {
    service: 'Gmail',
    auth: {
      user: 'ruben.sebbane@gmail.com',
      pass: '1991Boss?!'
    },
    templateDir: path.join(__dirname, '../../views/emailTemplates'),
    from: 'ruben.sebbane@gmail.com',
    testMode: false
  };

  sails.hooks.email.send(
    "resetPassword",
    {
      recipientName: this.first_name,
      senderName: "Wefoot",
      token:this.password_reset_token,
      email:this.email.toString()
    },
    {
      to: this.email.toString(),
      subject: "WeFoot : Demande de modification du mot de passe"
    },
    function(err) {console.log(err || "It worked!");})
}

}


};

