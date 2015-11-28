/**
 * FootController
 *
 * @description :: Server-side logic for managing Feet
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

 var moment = require('moment');

 function equiJoin(primary, foreign, primaryKey, foreignKey, select) {
  var m = primary.length, n = foreign.length, index = [], c = [];

    for (var i = 0; i < m; i++) {     // loop through m items
      var row = primary[i];
        index[row[primaryKey]] = row; // create an index for primary table
      }

    for (var j = 0; j < n; j++) {     // loop through n items
      var y = foreign[j];
        var x = index[y[foreignKey]]; // get corresponding row from primary
        c.push(select(x, y));         // select only the columns you need
      }

      return c;
    }

    module.exports = {

      create: function(req, res){
      var params = req.params.all(); //An id with undefined appears with postgres. TODO: fix it
      delete params.id;
      Foot.create(params, function FootCreated(err, foot){
        if(err){
          console.log(err);
          return res.status(406).end();         
        }
        else{
          var id = foot.id;
          var orga = req.param('created_by');
          Player.findOrCreate({foot: id, user: orga, statut: 3 },function OrganisatorAdded(err,player){
            if(err) return res.status(400).end();
          });
          async.each(req.param('toInvite'),function(user,callback){
            Player.findOrCreate({foot: id, user: user, statut: 1 },function PlayerAdded(err,player){
              if(err) return res.status(400).end();
              callback();
            });
          },function(){
            return res.status(200).json(foot);
          });
        }
      });
    },
    get: function(req,res){
      Foot.findOne(req.param('id'),function(err,foot){
        if(err) return res.status(400).end();
        return res.status(200).json(foot);
      })
    },

    update: function(req,res){
      Foot.update({id: req.param('id')},req.params.all(),function(err){
        if(err) { console.log(err); return res.status(400).end()};
        res.status(200).end(); 
      });
    },
    
    getFootByUser: function(req,res){ //SQL Query pour utiliser une jointure, Garde le footID(seconde position)
      Player.query("SELECT * FROM player p INNER JOIN foot f ON f.id=p.foot WHERE p.user ="+req.param('player')+" AND f.date > '"+moment().format('YYYY-MM-DD HH:mm:ss')+"' AND f.is_canceled <> TRUE ORDER BY f.date", function(err,foots){
        if(err) return res.status(400).end();
        //Using foot.rows for postgres queries
        return res.json(foots.rows).status(200).end();
      });
    },

    getInfo: function(req,res){
      var info = {};
      Foot.findOne().where({
        id: req.param('id')
      }).exec(function(err,foot){
        if(!foot || err) return res.status(400).end();
        User.findOne().where({id:foot.created_by}).exec(function(err,user){
          if(err) return res.status(400).end();
          if(!user) return res.status(400).end();
          info.orga = user.id;
          info.orgaName = user.first_name + " "+ user.last_name;
          info.picture = user.picture;
          if(info.field) res.json(info).status(200).end();
        });
      });
      Foot.query('SELECT f.date ,t.name,t.id,t.picture,t.city,t.zip_code,t.address,t.telephone,t.api_ref,t.partner, t.student_discount, t.origin FROM field t INNER JOIN foot f ON f.field = t.id WHERE f.id ='+req.param('id'),function(err,field){
        if(err) return res.status(400).end();
        if(!field) return res.status(400).end();
        //Careful, the date in field[0] belongs to the foot
        //info.field = field[0]; FOR POSTGRES
        info.field = field.rows[0]; //FOR POSTGRES
        if(info.orgaName) return res.json(info).status(200).end();
      });      
    },

    getPlayers: function(req,res){
      Player.find().where({
        or:[{
          foot: req.param('id'),
          statut : 2
        },
        {
          foot: req.param('id'),
          statut : 3 
        }]
      }).exec(function(err,players){
        results = _.pluck(players, 'user');
        if(err) return res.status(400).end();
        return res.json(results).status(200).end();
      });

    },
    //update player status in foot
    updatePlayer: function(req,res){
      Foot.findOne({id: req.param('foot')},function(err,foot){
        if(!foot) return res.status(200).end();
        if(err) return res.status(400).end();
        if(foot.confirmed_players < foot.nb_player){
          foot.confirmed_players = foot.confirmed_players+1;
          foot.save(function(err){
            if(err){
              console.log(err);
              return res.status(400).end;
            }
            Player.update({user: req.param('user'),foot: req.param('foot')},{statut:2},function(err,player){
              if(err){
                foot.confirmed_players--;
                foot.save();
                return res.status(400).end();
              }
              return res.status(200).end();
            });
          });
        }
        else return res.status(406).end();
      });
    },

    getAllPlayers: function(req,res){
      Player.find({foot:req.param('id')},function(err,players){
        if(err) return res.status(400).end();
        res.status(200).json(players);
      });
    },

    sendInvits: function(req,res){
      async.each(req.param('toInvite'),function(user,callback){
        Player.findOrCreate({foot: req.param('id'), user: user, statut: 1 },function PlayerAdded(err,player){
          if(err) return res.status(400).end();
          callback();
        });
      },function(){
        return res.status(200).end();
      });
    },

    removePlayer: function(req,res){
      Player.destroy({foot: req.param('foot'), user: req.param('user')},function(err){
        if(err) return res.status(400).end();
        Foot.findOne({id: req.param('foot')},function(err,foot){
          if(err) return res.status(400).end();
          foot.confirmed_players = foot.confirmed_players-1;
          foot.save();
          return res.status(200).end();
        });
      });
    },

    refusePlayer: function(req,res){
      Player.destroy({foot: req.param('foot'), user: req.param('user')},function(err){
        if(err) return res.status(400).end();
        return res.status(200).end();
      });
    },


    deleteFoot: function(req,res){
      Player.destroy({foot: req.param('foot')},function(err){
        if(err) return res.status(400).end();
        Foot.update({id:req.param('foot')},{is_canceled: true},function(err,foot){
          if(err) return res.status(400).end();
          return res.status(200).end();
        });
      });
    },

    query: function(req,res){
      var dateReq = moment(req.param('date')).format('llll').substring(0,17);

      var lat = req.param('lat');
      var longi = req.param('lng');
      dateReq = dateReq.replace(/,+/g, '');
      Field.find().where({
        cleanname: {
          'contains': ToolsService.clean(req.param('field')) 
        }  
      }).exec(function(err,fields){
        if(err) return res.status(400).end();
        fieldsId = _.pluck(fields,'id');
        Foot.find().where({
          field: fieldsId,
          priv: false,
              date: {   //Changes for Postgres
                '>=': moment(req.param('date')).hours(0).minutes(0).seconds(0).format(),
                '<=': moment(req.param('date')).add(1, 'days').hours(0).minutes(0).seconds(0).format(),
              }
            }).exec(function(err,foots){
              if(err) return res.status(400).end();

                foots = _.filter(foots,function(foot){return foot.nb_player>foot.confirmed_players;}); //Remove complete foots
                if(foots.length>0){
                  var footsfield = equiJoin(fields, foots, "id", "field", function(b,a){
                    return {
                      booked: a.booked,
                      confirmed_players:a.confirmed_players,
                      createdAt:a.createdAt,
                      created_by:a.created_by,
                      date:a.date,
                      friend_can_invite:a.friend_can_invite,
                      id:a.id,
                      field:a.field,
                      is_canceled:a.is_canceled,
                      level:a.level,
                      nb_player:a.nb_player,
                      priv:a.priv,
                      lat:b.lat,
                      longi:b.longi
                    };
                  });

                  ToolsService.distCalc(lat, longi, footsfield, function(results){
                    res.status(200).json(_.sortBy(results, 'distance'));
                  });
                }
                else
                  res.status(200).json([]);
              });
});
},
askToPlay: function(req,res){
  Player.findOrCreate({foot: req.param('foot'),user: req.param('userId'), statut: 0},function(err){
    if(err) return res.status(400).end();
    res.status(200).end();
  });
}
};

