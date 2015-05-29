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
      bcrypt.hash(attrs.password, salt, function(err, hash) {
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

//permet de crypter le MDP après modification
// beforeUpdate: [ function(attrs, next) {

//   if (!attrs.password) {
//     next();
//     return next();
//   }
//   else{
//   bcrypt.hash(attrs.password, salt, function(err, hash) {
//     if (err) return next(err);
//     attrs.password = hash;
//     attrs.password_confirmation = hash;
//     next();
//   });
// }
// }
//   ],



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

// afterCreate: function(attrs,next) {
//   var jwt = require('jsonwebtoken');
//   var tok = jwt.sign(attrs,'123Tarbahh');
//   User.update(attrs.id,{token:tok}).exec(function(error,user) {  
//   });
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
 required: true,
 unique: true,
 email: true
},
password:{
 type: 'string',
 password: true
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
// frappe: {
//   type:'float',
//   defaultsTo:0
// },
// physique: {
//   type:'float',
//   defaultsTo:0
// },
// technique: {
//   type:'float',
//   defaultsTo:0
// },
// fair_play: {
//   type:'float',
//   defaultsTo:0
// },
// assiduite: {
//   type:'float',
//   defaultsTo:0
// },
favorite_club: {
 type:'string'
},
picture: {
  type:'string'
},

chats: {
  collection: 'chat',
  via: 'chatters'
},

passwordResetToken:{
  type:'string',
  defaultsTo:0
},

toJSON: function(){
  var obj= this.toObject();
  delete obj.password;
  delete obj.password_confirmation;
  return obj;
},
generatePasswordResetToken: function(next) {

  this.passwordResetToken = token();
  this.save(function (err) {
    if(err) return next(err);
    next();
  });
},

sendPasswordResetEmail: function() {
  console.log(sails.config.email);
  console.log(this.email);
  sails.hooks.email.send(
    "testEmail",
    {
      recipientName: this.first_name,
      senderName: "Wefoot",
      token:this.passwordResetToken
    },
    {
      to: this.email.toString(),
      subject: "WeFoot : Demande de modification du mot de passe"
    },
    function(err) {console.log(err || "It worked!");})
}

}

};

