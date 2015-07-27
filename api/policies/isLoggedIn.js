  module.exports =  function isLoggedIn (req, res, next){  
   var jwt = require('jsonwebtoken');   
   var auth = req.headers["authorization"];
   if(typeof auth !=='undefined'){                                              
    jwt.verify(auth,'123Tarbahh',function (err,decoded) {   
      if(err){
        return res.redirect('/');       
        next(); 
      } 
      if(decoded.id){
        if(decoded.id==req.param('id') || decoded.id==req.param('player') || decoded.id==req.param('user') || decoded.id==req.param('user1') || decoded.id==req.param('user2') || decoded.id==req.param('created_by')) {
          console.log("autorized");
          next();
        }
        else {
         console.log("not autorized");
         return res.redirect('/');       
         next(); 
       }
     }
     else{
      console.log("not autorized");
      return res.redirect('/');      
      next();  
    }

  });
  }

  else{ 
    console.log("not autorized");
    return res.redirect('/');
    next(); 
  }
};