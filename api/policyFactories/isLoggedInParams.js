module.exports = function(param, param2){
	return function(req, res, next){
		var jwt = require('jsonwebtoken');   
		var auth = req.headers["authorization"];
		if(typeof auth !=='undefined'){                                              
			jwt.verify(auth,'123Tarbahh',function (err,decoded) {   
				if(err){
					console.log("not autorized");
					return res.redirect('/');       
					next(); 
				} 
				if(decoded.id){
					if(req.param(param))
						if(decoded.id == req.param(param) || decoded.id == req.param(param2))
							next();
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
	}
};