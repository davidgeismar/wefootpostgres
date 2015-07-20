/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {

  create: function(req, res, next){
    var jwt = require('jsonwebtoken');
    User.create(req.params.all(), function userCreated(err, user){
      if(err){
        console.log(err);
        return res.status(406).end();         
      }
      if(!user) return res.status(200);
      var tok = jwt.sign(user,'123Tarbahh');
            User.update(user.id,{token:tok}).exec(function(error,user) {   // TODO Use After Create to be faster
              res.status(200);
              res.json(user);
            });
          });
  },

  update: function(req,res,next){
    User.update({id: req.param('id')},req.params.all(),function(err,user){
      if(err) return res.status(400).end();
      res.status(200).json(user[0]);
    });
  },

  get: function(req,res){
    User.findOne(req.param('id'),function(err,user){
      if(err) return res.status(400).end();
      if(!user) return res.status(200).end();
      delete user.token;
      delete user.password_reset_token;
      delete user.mangoId;
      return res.status(200).json(user);
    })
  },
  
  profil: function(req, res, next){
    var jwt = require('jsonwebtoken');   
    var auth = req.headers["authorization"];
       if(typeof auth !=='undefined'){                                              //Checking auth is not null
        jwt.verify(auth,'123Tarbahh',function (err,decoded) {     // Decode token
          if(err) return next(err);
          if(decoded.id && decoded.id==req.param('id')){     // Check if token matches users token         
            res.status(200).json(decoded);
          }
          else res.status(403).end();
        });
      }
      else res.status(403).end();
    },

    uploadProfilPic: function  (req, res) {
      var fs = require('fs');
      var easyimg = require('easyimage'); 
      var uploadFile = req.file('file');
      var path = require('path');
      uploadFile.upload({ dirname: '../../.tmp/public/images/profils' ,saveAs:req.body.userId+".jpg"} ,function onUploadComplete (err, files) {  //Here to display the cropped image without restarting the server
        if (err) return res.serverError(err);
        var url = path.join(__dirname,'../../.tmp/public/images/profils/'+req.body.userId+'.jpg'); 
        easyimg.info(url).then(function(file){  //RESIZING IMAGES
          var min = Math.min(file.width,file.height);
          easyimg.crop({
            src:url,dst:url,cropwidth: min,cropheight: min
          }).then(function(file2){
            console.log(file2);
            var url2 = path.join(__dirname,'../../assets/images/profils/'+req.body.userId+'.jpg'); //Allow to keep the file after server restart
            fs.readFile(url,function(err,contentPic){
              console.log(contentPic);
              fs.writeFile(url2,contentPic,function(err){
                console.log(err);
                if(!err) console.log('done');
              });
            });
            User.update(req.body.userId,{picture: 'http://62.210.115.66:9000/images/profils/'+req.body.userId+'.jpg'},function(err){
              if(err) return res.status(400).end();
              console.log('here');
              res.status(200).send('http://62.210.115.66:9000/images/profils/'+req.body.userId+'.jpg');
            });
          });
        },function(err){console.log(err); res.status(400).end(); });
        // ({src:'../../assets/images/profils'+req.body.userId+'.jpg',

        // });
        //  IF ERROR Return and send 500 error with error
        //console.log(files);
      });
},

index: function (req,res) {
  res.status(403).end();
},

search: function (req,res) {
  var word = ToolsService.clean(req.param('word'));
  User.find().where({
    full_name: {
      'contains': word 
    }  
  }).limit(10).exec(function(err,user){
    if(err) return res.status(404).end();
    res.status(200);
    res.json(user);
  });     
},

addFriend: function (req,res) {
  result = {};
  if(req.param('facebook_id') && req.param('user1')){
    User.findOne({facebook_id:req.param('facebook_id')}).exec(function(err,user){
      Friendship.create({user1: req.param('user1'), user2: user.id},function(err,friendship){
        if(err) return res.status(400).end();
        delete user.token;
        return res.status(200).json(user);
      });
    });
  }
  else if(req.param('user1') && req.param('user2')){
    Friendship.create({user1: req.param('user1'), user2: req.param('user2')},function(err,friendship){
      if(err) return res.status(400).end();
      User.findOne(req.param('user2'),function(err,user){
        if(err) return res.status(400).end();
        if(!user) return res.status(200);
        else{ 
          delete user.token;
          return res.status(200).json(user);
        }
      });
    });
  }
  else res.status(400).end();
},
getAllFriends: function (req,res){ 
  var statuts = [];
  var results = [];
  var toSend = [];
  Friendship.find().where({
    or:[{
     user1: req.param('id') },
     { user2: req.param('id')
   }]
 }).skip(req.param('skip')).exec(function(err,friendships){
  if(err) res.status(400).end();
  else{ 
              _.each(friendships, function(friendship){       // Loop to get the ids of friends    
                if(friendship.user1 == req.param('id')){
                  results.push(friendship.user2);
                  if(friendship.statut%2==1)
                    statuts.push({stat: 1,friendship: friendship.id});              // Session user added the other as favorite
                  else
                    statuts.push({stat: 0,friendship: friendship.id});
                }
                else{
                  results.push(friendship.user1);
                  if(friendship.statut>=2)
                    statuts.push({stat: 1,friendship: friendship.id});
                  else
                    statuts.push({stat: 0,friendship: friendship.id});
                }
              });
            User.find().where({id:results}).limit(20).exec(function(err,users){   // Find users contained in results
              if(err) res.status(400).end();
              else{
                async.each(users, function(user,callback){      // Remove token from json
                  toSend.push(statuts[results.indexOf(user.id)]);
                  delete user.token;
                  callback();
                },function(){
                  res.status(200).json([users,toSend]);
                }); 
              }
            });
          }
        });
},
addFavorite: function(req,res){
  console.log(req.params.all());
  Friendship.findOne().where({
    or:[{
     user1: req.param('id1'),
     user2: req.param('id2')
   },
   {
     user1: req.param('id2'),
     user2: req.param('id1')
   }]             
 }).exec(function(err,friendship){
  console.log(friendship);
  if(err) res.status(400).end();
  if(!friendship) res.status(400).end();
  else{
    if(friendship.user1 == req.param('id1')){
      if(friendship.statut == 2)
        Friendship.update({id:friendship.id},{statut:3},function(err,user){
          if(err) res.status(400).end();
        });
      else if(friendship.statut == 0){
        Friendship.update({id:friendship.id},{statut:1},function(err,user){
          if(err) res.status(400).end();
        });
      }
    }
    else if(friendship.user2 == req.param('id1')){
      if(friendship.statut == 1){
        Friendship.update({id:friendship.id},{statut:3},function(err,user){
          if(err) res.status(400).end();
        });
      }
      else if(friendship.statut == 0){
        Friendship.update({id:friendship.id},{statut:2},function(err,user){
          if(err) res.status(400).end();
        });
      }
    }
    res.status(200).json(friendship);
  }
});
},
removeFavorite: function(req,res){
  Friendship.findOne().where({
    or:[{
     user1: req.param('id1'),
     user2: req.param('id2')
   },
   {
     user1: req.param('id2'),
     user2: req.param('id1')
   }]         
 }).exec(function(err,friendship){
  if(err) res.status(400).end();
  if(!friendship) res.status(400).end();
  else{

    if(friendship.user1 == req.param('id1')){
      if(friendship.statut == 3)
        Friendship.update({id:friendship.id},{statut:2},function(err,user){
          if(err) res.status(400).end();
        });
      else if(friendship.statut == 1)
        Friendship.update({id:friendship.id},{statut:0},function(err,user){
          if(err) res.status(400).end();
        });
    }
    else if(friendship.user2 == req.param('id1')){
      if(friendship.statut == 3)
        Friendship.update({id:friendship.id},{statut:1},function(err,user){
          if(err) res.status(400).end();
        });
      else if(friendship.statut == 2)
        Friendship.update({id:friendship.id},{statut:0},function(err,user){
          if(err) res.status(400).end();
        });
    }
    res.status(200).json(friendship);
  }
});
},

    // checkConnect: function(req,res){   // FIX BUGS HERE
    //  var jwt = require('jsonwebtoken');   
    //  var auth = req.headers["authorization"];
    //    if(typeof auth !=='undefined'){                                              //Checking auth is not null
    //     jwt.verify(auth,'123Tarbahh',function (err,decoded) {     // Decode token
    //       if(err) return res.status(406).end();
    //       if(decoded.id && decoded.id==req.param('id')){     // Check if token matches users token  
    //         res.status(200).end();    
    //       }
    //       else res.status(406).end();
    //     });
    //   }
    //   else res.status(406).end();
    // },

    updatedAta: function(req,res){
      var jwt = require('jsonwebtoken');   
      User.find().where({id:{ '>':req.param('start')}}).exec(function(err,users)
      {
        _.each(users,function(user){
          var name = ToolsService.clean(user.first_name)+ToolsService.clean(user.last_name);
          var tok = jwt.sign(user,'123Tarbahh');
          var identifiant = user.id.toString();
          User.update({id:identifiant},{token:tok,full_name:name},function(err,user){});
        });
        res.redirect('/');
      });
    },

    editUser: function(req,res){
      var jwt = require('jsonwebtoken');
      var auth = req.headers["authorization"];
      jwt.verify(auth,'123Tarbahh',function (err,decoded) { 
        if(err) {res.status(406).end();}
        else{
          User.update({id: decoded.id.toString()},req.params.all(),function(err,user){
            res.status(200).end();
          });
        }
      });
    },


    facebookConnect: function(req,res){
      var jwt = require('jsonwebtoken');
      if(req.param('facebook_id')){
        User.findOne({facebook_id:req.param('facebook_id')},function(err,user){
          if(err) return res.status(404).end();
          if(!user)
          {
            if(!req.param('email')){
              var email = req.param('fbtoken')+"@facebook.com";
            }
            else
              var email = req.param('email');
          User.create({email:email, first_name:req.param('first_name'), last_name:req.param('last_name'), facebook_id:req.param('facebook_id'), fbtoken:req.param('fbtoken')}, function userCreated(err, user){   // CREATE ACCOUNT
            if(err){ console.log(err); return res.status(400).end();}    
            var tok = jwt.sign(user,'123Tarbahh');
            var name = ToolsService.clean(user.first_name)+ToolsService.clean(user.last_name);
            User.update(user.id,{token:tok, full_name:name,picture: 'https://graph.facebook.com/'+user.facebook_id+'/picture?width=400&height=400'}).exec(function(error,user) {   // TODO Use After Create to be faster
              res.status(200).json(user[0]);
            });
          });
        }
        else if(user.facebook_id){   // USER CREATED
          res.status(200).json(user);
        }
        else return res.status(406).end();
      });
}
  else{   // CHECK USER WITHOUT EMAIL
    res.status(406).send('Error getting facebook profile');
  }
},


resetPassword: function(req,res){
  User.findOneByEmail(req.param('email')).exec(function(err,user){
    if (err){
      console.log(err);
      return res.status(406).end();
    }
    if(user && !user.facebook_id){
      user.generatepassword_reset_token();
      user.sendPasswordResetEmail();
      return res.status(200).end();
    }
    else{
      return res.status(406).end();
    }
  });
},

newPassword: function(req,res){


  User.findOne({email:req.param('email'), password_reset_token:req.param('token')}).exec(function(err,user){
    if(err)
      return res.status(406).end();
    if(!user || !user.password_reset_token)
      return res.status(406).end();
    else{
      User.update({email:req.param('email')}, {password:req.param('password'), password_reset_token:null}).exec(function(err, updatedUser){
        // return res.status(200).message("Le mot de passe a bien été modifié");
        if(err){
          console.log(err);
          return res.status(406);
        }
        return res.status(200);


      });

    }

  });
},

updateSeen: function(req,res){
  User.update({id : req.param('id')},{last_seen: new Date()},function(err,user){res.status(200).json(user[0]);});
},
getLastNotif: function(req,res){
  var moment = require('moment');
  last_seen = moment(req.param('last_seen')).format();
  Actu.find()
  .where({user: req.param('id')})
  .where({ createdAt: {'>':last_seen}})
  .exec(function(err,vals){
    console.log(vals);
    if(err){console.log(err); return res.status(400).end();}
    res.status(200).json(vals);
  });
},
toConfirm: function(req,res){
  var moment = require('moment');
  Player.find({user: req.param('user'),statut: 0},function(err,players){
    if(err) return res.status(400).end();
    if(players.length == 0) return res.status(200).end();
    players = _.pluck(players,'foot');
    Foot.find({created_by: req.param('id'), id: players, date:{'>': moment().format()}},function(err,foot){
      if(err) return res.status(400).end();
      console.log(foot);
      res.status(200).json(foot);
    });
  });
}





};


