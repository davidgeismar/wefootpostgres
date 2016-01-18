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

  // getHommeAndChevre: function (req, res) {
  //     // console.log(req.param("id"));
  //     Trophe.find({foot: req.param('id')}, function(err, trophes){
  //       if(!trophes) {return res.status(400).end();}
  //       if(trophes){
  //         _.each(trophes, function(trophe, index){
  //           User.find(trophe.id, function(err, user){
  //             // console.log(user);
  //             if (trophe.trophe == 0) {var chevre = trophe; chevre.picture = user.picture; chevre.name = user.first_name; };
  //             if (trophe.trophe == 1) {var homme = trophe; homme.picture = user.picture; homme.name = user.first_name;};
  //             if (index == trophes.length - 1)

  //               return res.status(200).json({chevre: chevre, homme: homme});
  //           });
  //         });
  //       }
  //     });
  //   }

    getHommeAndChevre: function (req, res) {
      // console.log(req.param("id"));
      var HC = [];
      Trophe.find({foot: req.param('id')}, function(err, trophes){
        if(!trophes) {return res.status(400).end();}
        if(trophes){
          _.each(trophes, function(trophe, index){
            User.findOne(trophe.user).exec(function(err, user){
              // if (trophe.trophe == 0) {
              //   console.log("here");
              //   var chevre =
              //   { trophe:trophe,
              //     picture:user.picture,
              //     name:user.first_name
              //   }
              //   }
              // if (trophe.trophe == 1) {

              //   var homme =
              //   { trophe:trophe,
              //     picture:user.picture,
              //     name:user.first_name
              //   }
              // }
              HC.push({ trophe:trophe,
                  picture:user.picture,
                  name:user.first_name
                });
              if (index == trophes.length - 1){
                return res.status(200).json(HC);
              }
            });
          });
        }
      });
    }


  // getHommeAndChevre: function (req, res) {
  //   Trophe.query('SELECT "user".id, "user".picture, "user".first_name, "trophe".trophe FROM "user" INNER JOIN "trophe" ON "trophe".user = "user".id WHERE "trophe".foot ='+req.param('id'), function(err,trophes){
  //     // console.log(trophes)
  //     if(!trophes) {return res.status(400).end();}
  //     if(trophes){
  //       _.each(trophes, function(trophe, index){
  //         console.log("trophé@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@ ")
  //         if (trophe.trophe == 0) {  console.log("chèvre!!!!!!!!!!!!!!!" ); };
  //         if (trophe.trophe == 1) {  console.log("homme!!!!!!!!!!!!!!"); };
  //         if (index == trophes.length - 1) { return res.status(200).json({chevre: chevre, homme: homme});};
  //       })
  //     }
  //   });
  // }


 };

