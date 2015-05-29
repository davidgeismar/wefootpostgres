  module.exports =  function isLoggedIn (req, res, next){   // FIX BUGS HERE
   var jwt = require('jsonwebtoken');   
   var auth = req.headers["authorization"];
       if(typeof auth !=='undefined'){                                              //Checking auth is not null
        jwt.verify(auth,'123Tarbahh',function (err,decoded) {     // Decode token
          if(err) return next(err);
          if(!decoded.id || !decoded.id==req.param('id')){
            console.log(" no autorization ");
            return res.redirect('/');     // Check if token matches users token  
                
          }
          else {
            //res.status(200).end();
            console.log("autorization");
            next();
          }
        });
      }

      else{ 
        console.log(" no autorization ");
        return res.redirect('/');
      }
    };