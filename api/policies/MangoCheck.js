  module.exports =  function isLoggedIn (req, res, next){  
  	var jwt = require('jsonwebtoken');   
  	var auth = req.headers["authorization"];

  	if(typeof auth !=='undefined'){                                              
  		jwt.verify(auth,'123Tarbahh',function (err,decoded) {   
  			if(err){
  				return res.redirect('/');       
  				next(); 
  			} 
  			if(decoded){
  				User.findOne({mangoId:req.param('mangoId')}).exec(function(err, user){
  					if(err){
  						return res.redirect('/');       
  						next(); 
  					}
  					if(user.id == decoded.id){
  						next();
  					}
  					else{
  						return res.redirect('/');       
  						next(); 
  					}
  				})

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