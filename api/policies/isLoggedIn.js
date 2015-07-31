  module.exports =  function isLoggedIn (req, res, next){  
   var jwt = require('jsonwebtoken');   
   var auth = req.headers["authorization"];

   if(typeof auth !=='undefined'){                                              
    jwt.verify(auth,'123Tarbahh',function (err,decoded) {   
      if(err){
        console.log("1 not autorized");
        return res.status(401).end();       
        next(); 
      } 
      if(decoded){
        next();
      }
      else{
        console.log("2 not autorized");
        return res.status(401).end();   
        next();  
      }

    });
  }

  else{ 
    console.log("3 not autorized");
    return res.status(401).end(); 
    next(); 
  }
};