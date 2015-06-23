/**
 * SessionController
 *
 * @description :: Server-side logic for managing sessions
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 module.exports = {

  login: function(req,res,next){
    var bcrypt = require('bcrypt');

    User.findOneByEmail(req.param('email'), function(err, user){
     if (err) return next(err);

     if (user && user.password) {
      bcrypt.compare(req.param('password'), user.password, function (err, match) {
        if (err) return next(err);

        if (match) {
          
          res.status(200).json(user);
        } else {
            // invalid password
            if (req.session.user) req.session.user = null;
            res.status(403).end();  
          }
        });
    } else {
      res.status(403).end();  
    }

  });
  },

  create: function(req,res) {
    Session.create(req.params.all(),function(err){
      if(err) { console.log(err); return res.status(400).end();}
      return res.status(200).end();
    });
  },

  isConnected: function(req,res){ //When user restart the app
    console.log('called at least');
    Session.findOne({uuid: req.param('uuid')},function(err,session){
      console.log(session);
      if(err) {console.log(err); return res.status(400).end();}
      if(session)
        return res.status(200).json({userId : session.user});
      else 
        return res.status(200).json({userId: 0});
    });
  },

  delete: function(req,res){
    Session.destroy({uuid: req.param('uuid')},function(err){
      if(err) {console.log(err); return res.status(400).end();}
      else return res.status(200).end();
    });
  }
  
};

