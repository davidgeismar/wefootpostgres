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
      var tok = jwt.sign(user,'123Tarbahh');
            User.update(user.id,{token:tok}).exec(function(error,user) {   // TODO Use After Create to be faster
              res.status(200);
              res.json(user);
            });
          });
  },
  
  profil: function(req, res, next){
    var jwt = require('jsonwebtoken');   
    var auth = req.headers["authorization"];
       if(typeof auth !=='undefined'){                                              //Checking auth is not null
        jwt.verify(auth,'123Tarbahh',function (err,decoded) {     // Decode token
          if(err) return next(err);
          if(decoded.id && decoded.id==req.param('id')){     // Check if token matches users token         
            res.status(200);
            res.json(decoded);
          }
          else res.status(403).end();
        });
      }
      else res.status(403).end();
    },

    uploadProfilPic: function  (req, res) {
      if(req.method === 'GET')
        return res.json({'status':'GET not allowed'});            
      //  Call to /upload via GET is error

      var uploadFile = req.file('file');


      uploadFile.upload({ dirname: '../../assets/images/profils' ,saveAs:req.body.fieldId+".jpg"} ,function onUploadComplete (err, files) {        


        if (err) return res.serverError(err);               
        //  IF ERROR Return and send 500 error with error
        
        //console.log(files);
        res.json({status:200,file:files});
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
      }).limit(10).exec(function(err,univ){
        if(err) return res.status(404).end();
        res.status(200);
        res.json(univ);
      });     
    },
    addFriend: function (req,res) {
      var finish = false;
      result = {}; 
      if(req.param('user1') && req.param('user2')){
        Friendship.create({user1: req.param('user1'), user2: req.param('user2')},function(err,user){
          if(err) return res.status(400).end();
            User.find(req.param('user2'),function(err,user){
              if(err) return res.status(400).end();
              else{ 
                delete user.token;
                finish = true;
                res.status(200).json(user);
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
     }).exec(function(err,friendships){
      if(err) res.status(400).end();
      else{ 
              _.each(friendships, function(friendship){       // Loop to get the ids of friends            
                if(friendship.user1 == req.param('id')){
                  results.push(friendship.user2);
                  if(friendship.statut%2==1)
                    statuts.push(1);              // Session user added the other as favorite
                  else
                    statuts.push(0);
                }
                else{
                  results.push(friendship.user1);
                  if(friendship.statut%2>1)
                    statuts.push(1);
                  else
                    statuts.push(0);
                }
              });
            User.find().where({id:results}).limit(20).exec(function(err,users){   // Find users contained in results
              if(err) res.status(400).end();
              else{
                _.each(users, function(user){      // Remove token from json
                  toSend.push(statuts[results.indexOf(user.id)]);
                  delete user.token;
                });
                res.status(200).json([users,toSend]);
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

    checkConnect: function(req,res){   // FIX BUGS HERE
     var jwt = require('jsonwebtoken');   
     var auth = req.headers["authorization"];
       if(typeof auth !=='undefined'){                                              //Checking auth is not null
        jwt.verify(auth,'123Tarbahh',function (err,decoded) {     // Decode token
          if(err) return res.status(406).end();
          if(decoded.id && decoded.id==req.param('id')){     // Check if token matches users token  
            res.status(200).end();    
          }
          else res.status(406).end();
        });
      }
      else res.status(406).end();
    },

    updateData: function(req,res){
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
    //       }
    //       else res.status(403).end();
    //     });
    //   }
    //   else res.status(403).end();
    // }
  },

  facebookConnect: function(req,res){
    var jwt = require('jsonwebtoken');
    if(req.param('email')){
      User.findOneByEmail(req.param('email'),function(err,user){
        if(err) return res.status(404).end();
        if(!user){
          User.create(req.params.all(), function userCreated(err, user){   // CREATE ACCOUNT
            if(err){ console.log(err); return res.status(400).end();}    
            var tok = jwt.sign(user,'123Tarbahh');
            var name = ToolsService.clean(user.first_name)+ToolsService.clean(user.last_name);
            User.update(user.id,{token:tok, full_name:name}).exec(function(error,user) {   // TODO Use After Create to be faster
              res.status(200);
              res.json(user);
            });
          });
        }
        else if(user.facebook_id){   // USER CREATED
          res.status(200);
          res.json(user);
        }
        else if(user.facebook_id==null){   // JOIN TO AN EXISTING USER
        User.update(user.id,{facebook_id: req.param('id')},function(error,user1){  // TODO Faille ici on peut pirater si le token n'est pas défini, vérifier qu'il est bon.
          if(err) return res.status(404);
          if(user1) { res.status(200); res.json(user);}
          else return res.status(406).end();
        });
      }
      else return res.status(406).end();
    });
}
  else{   // CHECK USER WITHOUT EMAIL
    res.status(406).send('Votre email ne peut être récuperé, inscrivez vous normalement avant de joindre votre compte.');
  }
},


resetPassword: function(req,res){
  User.findOneByEmail(req.param('email')).exec(function(err,user){
    if (err){
      console.log(err);
      return res.status(406).end();
    }
    if(user && !user.facebook_id){
    user.generatePasswordResetToken();
    user.sendPasswordResetEmail();
      return res.status(200).end();
    }
    else{
      return res.status(406).end();
    }
  });
},

newPassword: function(req,res){


  User.findOne({email:req.param('email'), passwordResetToken:req.param('token')}).exec(function(err,user){
    if(err)
      return res.status(406).end();
    if(!user || !user.passwordResetToken)
      return res.status(406).end();
    else{
      User.update({email:req.param('email')}, {password:req.param('password'), passwordResetToken:null}).exec(function(err, updatedUser){
        // return res.status(200).message("Le mot de passe a bien été modifié");
        if(err){
          console.log(err);
          return res.status(406);
        }
        return res.status(200);

  
  });

}

});
}



};


