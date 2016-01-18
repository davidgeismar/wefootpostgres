/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var moment = require('moment');
var async = require('async');



module.exports = {

  create: function(req, res, next){
    var jwt = require('jsonwebtoken');
    var params = req.params.all();
    delete params.id;
    User.create(params, function userCreated(err, user){
      if(err){
        console.log(err);
        return res.status(406).end();
      }
      if(!user) return res.status(200);
      var tok = jwt.sign(user,'123Tarbahh');
            User.update(user.id,{token:tok, email:user.email.toLowerCase()}).exec(function(error,user) {   // TODO Use After Create to be faster
              res.status(200);
              res.json(user);
            });
          });
  },

  checkEmail:function(req,res){
    User.findOne({email:req.param('email')}).exec(function(err,user){
      if(err){ console.log(err); return res.status(400).end() ;}
      if(user)
        res.status(200).json({exists:true});
      else
        res.status(200).json({exists:false});
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

  getViaFbId: function(req,res){
    User.find({facebook_id: req.param('users')},function(err,users){
      if(err) return res.status(400).end();
      if(users.length == 0 || !req.param('users')) return res.status(200).end();
      users = _.map(users,function(user){ delete user.token; delete user.password_reset_token; delete user.mangoId; return user;});
      return res.status(200).json(users);
    });
  },

  getWholeUser: function(req,res){
    User.findOne(req.param('id'),function(err,user){
      if(err) return res.status(400).end();
      if(!user) return res.status(200).end();
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

    //WRITE FILE ON TMP FILE, THEN RESIZE IT, AND STORE IN AMAZON S3

  uploadProfilPic: function (req,res) {
    if(req.body.userId){
      var AWS_ACCESS_KEY = process.env.AWS_ACCESS_KEY;
      var AWS_SECRET_KEY = process.env.AWS_SECRET_ACCESS_KEY;
      var S3_BUCKET = process.env.S3_BUCKET_NAME;
      var easyimg = require('easyimage');
      var uploadFile = req.file('file');
      var path = require('path');
      var aws = require('aws-sdk');
      var fs = require('fs');
      var bucketUrl = 'https://'+S3_BUCKET+'.s3.amazonaws.com/';
      var picUrl = req.body.userId+'-'+new Date().getTime()+'.jpg';
      aws.config.update({accessKeyId: AWS_ACCESS_KEY, secretAccessKey: AWS_SECRET_KEY});
      var s3 = new aws.S3();
    uploadFile.upload({ dirname: '../../.tmp/public/images/profils' ,saveAs:req.body.userId+".jpg"} ,function onUploadComplete (err, files) {  //Here to display the cropped image without restarting the server
      if (err) return res.serverError(err);
      var url = path.join(__dirname,'../../.tmp/public/images/profils/'+req.body.userId+'.jpg');
      easyimg.info(url).then(function(file){  //RESIZING IMAGES
        var min = Math.min(file.width,file.height);
        easyimg.crop({
          src:url,dst:url,cropwidth: min,cropheight: min
        }).then(function(file2){
          fs.readFile(url,function(err,contentPic){ //GET THE CROPPED IMAGE
            var params = {
              Bucket: S3_BUCKET,
              Key: picUrl,
              Body: contentPic,
              ACL: 'public-read'
            }
            s3.putObject(params, function(err,data){
              if(err) return res.status(400);
              else {
                User.update(req.body.userId,{picture: bucketUrl+picUrl},function(err){
                  if(err) return res.status(400);
                  else return res.status(200).send(bucketUrl+picUrl);
                });
              }
            });
          });
        });
      });
    });
  }
  },

  //DEPECATED
  uploadProfilPicOLD: function  (req, res) {
    if(req.body.userId){
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
          var url2 = path.join(__dirname,'../../assets/images/profils/'+req.body.userId+'.jpg'); //Allow to keep the file after server restart
          fs.readFile(url,function(err,contentPic){
            fs.writeFile(url2,contentPic,function(err){
            });
          });
          // http://wefoot.herokuapp.com
          User.update(req.body.userId,{picture: 'http://localhost:1337/images/profils/'+req.body.userId+'.jpg'},function(err){
            if(err) return res.status(400).end();
            res.status(200).send('http://wefoot.herokuapp.com/images/profils/'+req.body.userId+'.jpg');
          });
        });
      },function(err){console.log(err); res.status(400).end(); });
      // ({src:'../../assets/images/profils'+req.body.userId+'.jpg',

      // });
      //  IF ERROR Return and send 500 error with error
      //console.log(files);
    });
  }
  else
  return res.status(400).end();
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
    }).limit(20).exec(function(err,users){
      if(err) return res.status(404).end();
      users = _.map(users,function(user){
        delete user.token;
        delete user.password;
        delete password_reset_token;
        return user;
      });
      res.status(200);
      res.json(users);
    });
  },

  addFriend: function (req,res) {
    result = {};
    if(req.param('facebook_id') && req.param('user1')){
      User.findOne({facebook_id:req.param('facebook_id')}).exec(function(err,user){
        if(!user) return res.status(400).end();
        Friendship.findOrCreate({user1: req.param('user1'), user2: user.id},function(err,friendship){
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

  isFriendWith: function(req,res){
    Friendship.findOne().where({
      or:[{
       user1: req.param('user1'), user2: req.param('user2') },
       { user1: req.param('user2'), user2: req.param('user1')}]}).exec(function(err,friendship){
        if(err) {console.log(err); return res.status(400).end();}
        if(friendship){
          return res.status(200).json(true);
        }
        else
          return res.status(200).json(false);
      });

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
      if(req.param('facebook_id') && req.param('email')){
        User.findOne({email:req.param('email'), facebook_id:null}).exec(function(err,user){
          if(user){
            User.update(user.id,{facebook_id:req.param('facebook_id'), fbtoken:req.param('fbtoken')});
            return res.status(200).json(user);
          }
          else {
            User.findOne({facebook_id:req.param('facebook_id')},function(err,user){
              if(err) return res.status(404).end();
              if(!user)
              {
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
    var bcrypt = require('bcrypt');
    User.findOne({email:req.param('email'), password_reset_token:req.param('token')}).exec(function(err,user){
      if(err)
        return res.status(406).end();
      if(!user || !user.password_reset_token)
        return res.status(406).end();
      else{
        bcrypt.genSalt(10, function(err, salt) {
          bcrypt.hash(req.param('password'), salt, function(err, hash) {
            if (err) return next(err);
            user.password = hash;
            user.password_confirmation = hash;
            user.password_reset_token = null;
            user.save(function(err){
              return res.status(200).end();
            });
          });
        });
      }
    });
  },

  updateSeen: function(req,res){
    User.update({id : req.param('id')},{last_seen: new Date()},function(err,user){res.status(200).json(user[0]);});
  },
  getLastNotif: function(req,res){
    last_seen = moment(req.param('last_seen')).format();
    Actu.find()
    .where({user: req.param('id')})
    .where({ createdAt: {'>':last_seen}})
    .exec(function(err,vals){
      if(err){console.log(err); return res.status(400).end();}
      res.status(200).json(vals);
    });
  },
  toConfirm: function(req,res){
    Player.find({user: req.param('user'),statut: 0},function(err,players){
      if(err) return res.status(400).end();
      if(players.length == 0) return res.status(200).end();
      players = _.pluck(players,'foot');
      Foot.find({created_by: req.param('id'), id: players, date:{'>': moment().format()}},function(err,foot){
        if(err) return res.status(400).end();
        res.status(200).json(foot);
      });
    });
  },

  addCard : function(req,res){
    TrelloAPI.addCard(req.param('bug'));
    res.status(200).end();
  },


  threeHoursBeforeMatch: function(req,res){
    var nowPlus3h10min = moment().add(3, 'hours').add(10, 'minutes').format();
    var nowPlus3h = moment().add(3, 'hours').format();
    Foot.find({ date: { '<': nowPlus3h10min, '>': nowPlus3h }}).exec(function(err, foots){
      if(err)
        console.log(err);
      if(foots.length > 0){
        async.each(foots, function(foot, callback){
          Player.find({foot:foot.id}).exec(function(err, players){
        //We send pushes
        var usersId = _.pluck(players, 'user');
        Push.find({user:usersId}).exec(function(err, pushes){
          if(pushes){
            PushService.sendPush(pushes, "Votre rencontre démarre dans 3h, ne soyez pas en retard");
          }
        });
        //We create actu and send it by socket
        async.each(players, function(player, callback2){
          Actu.create({user:player.user, related_user:player.user, typ:'3hoursBefore', related_stuff:foot.id}).exec(function(err,actu){
            if(err)
              console.log(err);
            Connexion.findOne({user:player.user}).exec(function(err, connexion){
              if(connexion){
                sails.sockets.emit(connexion.socket_id,'notif',actu);
              }
              callback2();
            });
          });

        },function(err){
          callback();
        });

      });
        },function(err){
          return res.status(200);
        });
      }
      else
        return res.status(200);
    });

  },

  beginVote: function(req,res){
    var nowMinus2h = moment().subtract(2, 'hours').format();
    var nowMinus3h = moment().subtract(3, 'hours').format();
    Foot.find({ date: { '<': nowMinus2h, '>': nowMinus3h }}).exec(function(err, foots){
      if(foots.length>0){
        async.each(foots, function(foot, callback){
          Player.find({foot:foot.id, statut:[2,3]}).exec(function(err, players){
            if(players.length>0){
              async.each(players, function(player, callback2){
                Actu.create({user:player.user, related_user:foot.created_by, typ:'endGame', related_stuff:foot.id}).exec(function(err,actu){
                  if(err)
                    console.log(err);
                  Connexion.findOne({user:player.user}).exec(function(err, connexion){
                    if(connexion){
                      sails.sockets.emit(connexion.socket_id,'notif',actu);
                    }
                    callback2();
                  });
                });
              },function(err){
                callback();
              });
            }
          });
        }, function(err){
          return res.status(200).end();
        });
      }
      else{
        return res.status(200).end();
      }
    });
  },

  endVote : function(req,res){
   var nowMinus3d = moment().subtract(3, 'days').format('YYYY-MM-DD HH:mm:ss');
   var nowMinus4d = moment().subtract(4, 'days').format('YYYY-MM-DD HH:mm:ss');
   var finish = 0;
    // On sélectionne les chevres et hommes des foots qui ont plus de 3 jours
    Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot WHERE v.chevre IS NOT NULL and f.date < '"+nowMinus3d+"' and f.date > '"+nowMinus4d+"' group by v.chevre, v.foot) x group by foot, chevre",function(err,results){
      if(results){
        var results = results.rows;
        async.each(results, function(result, callback){
          Trophe.create({foot:result.foot, trophe:0, user:result.chevre}).exec(function(err,tr){
            if (err)
              console.log(err);
            callback();
          });

        }, function(err){
          finish++;
          if(finish==2)
            return res.status(200).end();
        });
      }
      else
        finish++;
        if(finish==2)
          return res.status(200).end();
    });

    Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot WHERE v.homme IS NOT NULL and f.date < '"+nowMinus3d+"' and f.date > '"+nowMinus4d+"' group by v.homme, v.foot) x group by foot, homme",function(err,results){
     if(results){
        var results = results.rows;
        async.each(results, function(result, callback){
          Trophe.create({foot:result.foot, trophe:1, user:result.homme}).exec(function(err, tr){
            if (err)
              console.log(err);
            callback();
          });

        }, function(err){
          finish++;
          if(finish==2)
            return res.status(200).end();
        });
      }
      else
        finish++;
        if(finish==2)
          return res.status(200).end();
    });


    Foot.query("SELECT id FROM foot WHERE foot.date <'"+nowMinus3d+"' AND date >'"+nowMinus4d+"'", function(err, results){
      // console.log(results)
      _.each(results.rows, function(result, err){
        // console.log(result["id"]);
        Player.query("SELECT player.user, player.foot FROM player WHERE (player.statut = 2 OR player.statut = 3) AND player.foot ='"+result["id"]+"'", function(err, players){
          async.each(players.rows, function(player, callback){
            Actu.create({user:player["user"], related_user:player["user"], typ:'resultFoot', related_stuff: player["foot"]}).exec(function(err,actu){
              console.log("actuuu@@@@@@@@@@@@@@@@@@@@@@@@@@@@@")
              console.log(actu);
              if(err){
                console.log("erreur..................");
                console.log(err);}
              else {
                Connexion.findOne({user:player["user"]}).exec(function(err, connexion){
                  if (connexion){
                    sails.sockets.emit(connexion.socket_id,'notif',actu);
                      callback();
                    }
                  else {
                        callback();
                    }
                });
              }
            });
          },function(){
              res.status(200).end();
          })
        })
      })

    })
  },
}


