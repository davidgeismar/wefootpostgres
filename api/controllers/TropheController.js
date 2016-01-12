/**
 * TropheController
 *
 * @description :: Server-side logic for managing trophes
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {


 	getNbTrophes:function (req,res){

 		Trophe.find({user:req.param('id')}).exec(function(err,trophes){
 			if(err){
 				return res.status(400).end();
 			}
 			if(trophes){
 				var nbChevres = _.filter(trophes, function(trophe){return trophe.trophe==0}).length;
 				var nbHommes = _.filter(trophes, function(trophe){return trophe.trophe==1}).length;
 				return res.status(200).json({nbChevres : nbChevres,nbHommes : nbHommes });
 			}
 			else
 				return res.status(200).end();
 		})
 	},


  getHommeAndChevre: function (req, res) {
    console.log(req.param("id"));
    Trophe.query("SELECT 'user'.id, 'user'.picture, 'user'.first_name, 'trophe'.trophe FROM 'user' INNER JOIN 'trophe' ON 'trophe'.user = 'user'.id WHERE 'trophe'.foot ="+req.param('id'), function(err,trophes){
      console.log(trophes)
      // if(err) {console.log(err);}
      if(!trophes) {return res.status(400).end();}
      if(trophes){
        _each(trophes, function(trophe){
          if (trophe.trophe == 0) {var chevre = trophe};
          if (trophe.trophe == 1) { var homme = trophe};
        })
       return res.status(200).json({chevre: chevre, homme: homme})
      }
    });
  }


 };

