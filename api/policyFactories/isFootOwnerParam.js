module.exports = function(param){
	return function(req, res, next){
		var jwt = require('jsonwebtoken');   
  	var auth = req.headers["authorization"];
  	if(typeof auth !=='undefined'){                                              
  		jwt.verify(auth,'123Tarbahh',function (err,decoded) {   
  			if(err){
  				return res.status(401).end();       
  				next(); 
  			} 
  			if(decoded){
  				Foot.findOne(req.param(param)).exec(function(err, foot){
  					if(err){
  						return res.status(401).end();      
  						next();	
  					}
  					if(foot.created_by!=decoded.id){
  						return res.status(401).end();
  						next();       
  					}
  					else{
  						next();
  					}
  				});
  				
  			}
  			else{
  				console.log("not autorized");
  				return res.status(401).end();     
  				next();  
  			}

  		});
  	}

  	else{ 
  		console.log("not autorized");
  		return res.status(401).end();
  		next(); 
  	}
  }
};