module.exports = function(param){
	return function(req, res, next){
		var jwt = require('jsonwebtoken');   
		var auth = req.headers["authorization"];
		if(typeof auth !=='undefined'){                                              
			jwt.verify(auth,'123Tarbahh',function (err,decoded) {   
				if(err){
					console.log("4 not autorized");
					return res.status(401).end();       
					next(); 
				} 
				if(decoded.id){
					if(req.param(param))
						if(decoded.id == req.param(param))
							next();
					}
					else{
						console.log("5 not autorized");
						return res.status(401).end();      
						next();  
					}

				});
		}

		else{ 
			console.log("6 not autorized");
			return res.status(401).end(); 
			next(); 
		}
	}
};