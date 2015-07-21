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


 };

