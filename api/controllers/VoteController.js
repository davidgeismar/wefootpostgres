/**
 * ElectionController
 *
 * @description :: Server-side logic for managing elections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */


module.exports = {
 	//TO DO : VERIFIER QUE L'ELECTION N'EST PAS TERMINEE (PEUT ETRE SUR LE FRONT)

 	create: function(req, res, next){
 		Vote.create(req.param.all(),function voteCreated(err, vote){
 			if(err){
 				console.log(err);
 				return res.status(406).end();   
 			}
 			else{

 			}

 		});

 	},


 	getVoters: function(req,res){
 		Player.find().where({
 			or:[{
 				foot: req.param('footId'),
 				statut : 2
 			},
 			{
 				foot: req.param('footId'),
 				statut : 3 
 			}]
 		}).exec(function(err,players){
 			results = _.chain(players).ToolsService.pluckMany( "first_name", "picture", "id").value();
 			if(err) return res.status(400);
 			return res.json(results).status(200);
 		});
 	},

 	// checkEndAllElections: function(req, res, next){



 	// 	// Foot.find().where({
  //  //      and:[{
  //  //        date<=now-4
  //  //      },
  //  //      {
  //  //        isElectionOver: 'false'
  //  //      }]
  //  //    }).exec(function(err,foots){
  //  //    	foots.forEach(function(foot)
  //     		Election.query("select max(count(elu)) as nbVotes, elu,  foot, note from Vote v inner join foot f on f.id = v.foot where f.date < "+now() - 3+" or f.isElectionOver = false groupby v.note, v.foot, v.elu",function(err,results){

  //     		});

  //     			)
  //     		)
  //     	Election.find()

 	// 	Vote.find(,function electionsFound(err, votes){
 	// 		votes[0].populates('foot').exec(function(err,voteComplet){
 	// 			if(err)
 	// 				return res.status(406).end();   
 	// 			else{
 	// 				console.log(voteComplet);
 	// 				//On teste si tous les joueurs ont votés ou si le foot a plus de 3 jours
 	// 				if(votes[0].foot.nbPlayer==votes.length || votes[0].foot.createdAt+3<now){


 	// 				}
 	// 			}

 	// 		});

 	// 	});
 	// },



 	chevreAndHommeElection: function(req,res){


 	}






 };

