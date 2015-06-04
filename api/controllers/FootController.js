/**
 * FootController
 *
 * @description :: Server-side logic for managing Feet
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {

  create: function(req, res){
        Foot.create(req.params.all(), function FootCreated(err, foot){
            if(err){
                console.log(err);
                return res.status(406).end();         
            }
            else{
                var id = foot.id;
                var orga = req.param('created_by');
                Player.create({foot: id, user: orga, statut: 3 },function OrganisatorAdded(err,player){
                  if(err) return res.status(400).end();
                });
                async.each(req.param('toInvite'),function(user,callback){
                  Player.create({foot: id, user: user, statut: 1 },function PlayerAdded(err,player){
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
    Foot.update(req.param('id'),req.params.all(),function(err){
      if(err) return res.status(400).end();
      res.status(200).end(); 
    });
  },
    
    //   addPlayer: function (req,res) {
    //   if(req.param('foot') && req.param('user')){
    //     Friendship.create({user1: req.param('user1'), user2: req.param('user2')},function(err,user){
    //     if(err) return res.status(400).end();
    //     else{
    //     User.find(req.param('user2'),function(err,user){
    //       if(err) return res.status(400).end();
    //       else{ 
    //         delete user.token;
    //         res.status(200).json(user);
    //       }
    //     });
    //     }
    //   });
    // }
    // else res.status(400).end();
    // },
    getFootByUser: function(req,res){ //SQL Query pour utiliser une jointure, Garde le footID(seconde position)
      Player.query('SELECT * FROM player p INNER JOIN foot f ON f.id=p.foot WHERE p.user ='+req.param('player'), function(err,foots){
        console.log(err);
        if(err) return res.status(400).end();
        return res.json(foots).status(200).end();
      });
    },

    getInfo: function(req,res){
      var info = {};
      Player.findOne().where({
        foot: req.param('id'),
        statut : 3
      }).exec(function(err,player){
        if(err) return res.status(400).end();
        if(!player) return res.status(200).end();
        info.orga = player.user;
        User.findOne({id:player.user},function(err,user){
          if(err) return res.status(400).end();
          info.orgaName = "";
          if(user)
            info.orgaName = user.first_name + " "+ user.last_name;
          if(info.field) return res.json(info).status(200).end();   // Asychrone, permet de vérifier si l'autre query est fini.
        });
      });
      Foot.query('SELECT t.name,t.picture,t.city,t.zip_code,t.address,t.telephone FROM field t INNER JOIN foot f ON f.field = t.id WHERE f.id ='+req.param('id'),function(err,field){
        if(err) return res.status(400).end();
        if(!field) return res.status(200).end();
        info.field = field[0];
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

    updatePlayer: function(req,res){
      Player.update({user: req.param('user'),foot: req.param('foot')},{statut:2},function(err,player){
        if(err) return res.status(400).end();
        if(player.length == 0) return res.status(400).end();
        return res.status(200).end();
      });
    },

    getInvited: function(req,res){
      Player.find({foot:req.param('id')},function(err,players){
        if(err) return res.status(400).end();
        res.status(200).json(_.pluck(players,'user'));
      });
    },

    sendInvits: function(req,res){
      async.each(req.param('toInvite'),function(user,callback){
        Player.create({foot: req.param('id'), user: user, statut: 1 },function PlayerAdded(err,player){
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
        return res.status(200).end();
      });
    },

    deleteFoot: function(req,res){
      Player.destroy({foot: req.param('foot')},function(err){
        if(err) return res.status(400).end();
        return res.status(200).end();
      });
    },
};

