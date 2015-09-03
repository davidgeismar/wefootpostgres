/**
 * ElectionController
 *
 * @description :: Server-side logic for managing elections
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */
 var shrinkUsers = function(users){
  return _.map(users, function(obj) { return _.pick(obj, 'first_name' ,'picture', 'id'); });
};
var async = require('async');

module.exports = {
 	//TO DO : VERIFIER QUE L'ELECTION N'EST PAS TERMINEE (PEUT ETRE SUR LE FRONT)

 	create: function(req, res, next){
    var params = req.params.all();
    delete params.id;
    Vote.create(params, function VoteCreated(err, vote){
      if(err){
       console.log(err);
       return res.status(406).end();   
     }
     else{
      return res.status(200).json(vote);
    }

  });

  },

  //True or False
  getVotedStatus: function(req, res, next){
    Vote.findOne({electeur:req.param('electeur'), foot:req.param('footId')}).exec(function(err,vote){
      if(err)
        return res.status(406).end();
      else{
        if(!vote)
          return res.status(200).json(false);
        else{
          return res.status(200).json(true);
        }
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
  if(err) return res.status(400);
  var playersId = _.pluck(players, "user");
  User.find(playersId).exec(function(err,users){
    if(err) return res.status(400);
    var results = shrinkUsers(users);
    return res.json(results).status(200);
  });


});
}

// ,

// checkEndAllElections: function(req, res, next){

//   var nowMinus3 = new Date();
//   nowMinus3.setDate(nowMinus3.getDate()-3);
//   var nowMinus4 = new Date();
//   nowMinus4.setDate(nowMinus4.getDate()-4);

//           // On sélectionne les gagnants des foots qui ont plus de 3 jours et qui ne sont terminés  		
//           Vote.query("select max(nbVotes) as maxVotes, chevre, foot from (select count(*) as nbVotes, v.chevre, v.foot from vote v inner join foot f on f.id = v.foot group by v.chevre, v.foot where f.date <"+nowMinus3+" and f.date > "+nowMinus4+") x group by foot",function(err,results){

//             async.each(results, function(result, callback){
//               Trophe.create({foot:result.foot, trophe:0, user:result.chevre, nbVotes:result.maxVotes});
//               callback();
//             }, function(err){

//             });

//           });

//           Vote.query("select max(nbVotes) as maxVotes, homme, foot from (select count(*) as nbVotes, v.homme, v.foot from vote v inner join foot f on f.id = v.foot group by v.homme, v.foot where f.date <"+nowMinus3+" and f.date > "+nowMinus4+") x group by foot",function(err,results){
//             async.each(results, function(result, callback){
//               Trophe.create({foot:result.foot, trophe:1, user:result.homme, nbVotes:result.maxVotes});
//               callback();
//             }, function(err){

//             });

//           });

//         }

      };

