/**
 * NotationController
 *
 * @description :: Server-side logic for managing Notations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
 var async = require('async');

 module.exports = {

 	getGrade:function(req,res){
 		if(req.param('noteur') && req.param('note')){
 			Notation.find({noteur:req.param('noteur'),note:req.param('note')}).exec(function notationFound(err, note){
 				if(err){
 					return res.status(406).end(); 
 				}
 				return res.status(200).json(note);


 			});
 		}
 	},

 	grade: function(req, res){
 		if(req.param('noteur')){
 			Notation.update({noteur:req.param('noteur'),note:req.param('note')},{technique:req.param('technique'), fair_play:req.param('fair_play'), assiduite:req.param('assiduite'), physique:req.param('physique'), frappe:req.param('frappe')}).exec(function notationUp(err, note){
 				if(err){
 					console.log(err);
 					return res.status(406).end();         
 				}
 				if(note.length == 0){
 					var params = req.params.all();
 					delete params.id;
 					Notation.create(params).exec(function notationCr(err, noteC){
 						return res.status(200).json(noteC);
 					});
 				}
 				else{
 					return res.status(200).json(note);
 				}
 			});
 		}

 	},

 	getDetailledGrades: function(req, res){
 		if(req.param('note')){
 			Notation.find({note:req.param('note')}).exec(function notation(err, notes){
 				var sumGrades = [0,0,0,0,0];
 				var cptGrades = [0,0,0,0,0];
 				async.each(notes, function(note,callback){
 					if(note.frappe){
 						sumGrades[0]+= note.frappe;
 						cptGrades[0]+= 1;
 					}
 					if(note.physique){
 						sumGrades[1]+= note.physique;
 						cptGrades[1]+= 1;
 					}
 					if(note.technique){
 						sumGrades[2]+= note.technique;
 						cptGrades[2]+= 1;
 					}
 					if(note.fair_play){
 						sumGrades[3]+= note.fair_play;
 						cptGrades[3]+= 1;
 					}
 					if(note.assiduite){
 						sumGrades[4]+= note.assiduite;
 						cptGrades[4]+= 1;
 					}
 					callback();
 				},function(err){
 					if(cptGrades[0]!=0)
 						var frappe = sumGrades[0]/cptGrades[0];
 					else
 						var frappe = 0;
 					if(cptGrades[1]!=0)			
 						var physique = sumGrades[1]/cptGrades[1];
 					else
 						var physique = 0;
 					if(cptGrades[2]!=0) 		
 						var technique = sumGrades[2]/cptGrades[2];
 					else
 						var technique = 0;
 					if(cptGrades[3]!=0)
 						var fair_play = sumGrades[3]/cptGrades[3];
 					else
 						var fair_play = 0;
 					if(cptGrades[4]!=0)
 						var assiduite = sumGrades[4]/cptGrades[4];
 					else
 						var assiduite = 0;

 			// console.log(frappe);
 			// console.log(physique);
 			// console.log(technique);
 			// console.log(fair_play);
 			// console.log(assiduite);

 			res.status(200).json({nbGrades:notes.length, frappe:frappe, physique:physique, technique:technique, fair_play:fair_play, assiduite:assiduite});
 		});

});
}
}
};

