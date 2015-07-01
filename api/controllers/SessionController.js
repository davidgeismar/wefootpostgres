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

  isConnected: function(req,res){ //When user restart the app
     var jwt = require('jsonwebtoken');   
       if(req.param('token')!=='undefined'){                                           //Checking auth is not null
        jwt.verify(req.param('token'),'123Tarbahh',function (err,decoded) {     // Decode token
          if(err) return res.status(406).end();
          console.log('hello');
          console.log(decoded);
          if(decoded.id)     // Check if token matches users token  
            res.status(200).json(decoded);    
          else 
            res.status(200).end();
        });
      }
  }
  
};

