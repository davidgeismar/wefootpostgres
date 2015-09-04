var fs = require('fs');
var path = require('path');
var moment = require('moment');

module.exports = {
	getNumbers : function(callbackGeneral){
		var allReq = [];
		var counters = {};
		
		allReq.push(function(callback){
			User.find(function(err,users){
				console.log(err);
				 counters.user = users.length; //Problem couting users with postgres
				callback();
			});
		});

		allReq.push(function(callback){
			Foot.query('SELECT COUNT(*) FROM foot',function(err,foot){
				counters.foot = foot.rows[0]['count']; // Using rows for postgres
				callback();
			});
		});

		allReq.push(function(callback){
			Reservation.query('SELECT COUNT(*) FROM reservation',function(err,resa){
				counters.resa = resa.rows[0]['count'];
				callback();
			});			
		});

		allReq.push(function(callback){
			Connexion.query('SELECT COUNT(*) FROM connexion',function(err,connection){
				counters.connection = connection.rows[0]['count'];
				callback();
			});
		});

		async.each(allReq, function(func,callback){
			func(function(){
				callback();
			});
		},function(){
			callbackGeneral(counters);
		});
	},

	getEarningsByDay : function(callbackGeneral){
		var today = moment();
		var dates = [];
		dates.push(today.format("YYYY-MM-DD"));
		var earnings = [];
		for(var i=0; i<today.date()-1; i++){
			dates.push(today.subtract(1,'Day').format("YYYY-MM-DD"));
		}
		var url = path.join(__dirname,'../../comis.json');
		var coms = fs.readFileSync(url);
		coms = JSON.parse(coms);
		async.each(dates,function(date,callback){
			var money = 0;
			Paiement.find({createdAt: {'>=': date, '<': moment(date).add(1,'Day').format("YYYY-MM-DD")}},function(err,paiements){
				if(paiements.length==0) callback();
				_.each(paiements,function(paiement,index){
					if(err) callback(err);
					else{
						Foot.findOne(paiement.foot,function(err,foot){
							if(err || !foot) callback('err');
							else{
								money+= paiement.price*AdminServices.findCommission(coms,paiement.field,foot.date);
							}
							if(index == paiements.length-1){
								earnings.push({date:date, value: money});
								callback();
							}
						});
					}
				});
			});
		},function(err){
			if(err) callbackGeneral(0);
			else callbackGeneral(earnings);
		});
	},

	getUserByMonth : function(callbackGeneral){
		var today = moment();
		var firstDay = moment().subtract(today.date()-1,'Day');
		var dates = [];
		dates.push(firstDay.format("YYYY-MM-DD"));
		var counts = [];
		for(var i=0; i<11; i++){
			dates.push(firstDay.subtract(1,'Month').format("YYYY-MM-DD"));
		}
		async.each(dates,function(date,callback){
			User.find({createdAt: {'>=': date, '<': moment(date).add(1,'Month').format("YYYY-MM-DD")}},function(err,users){
				if(err) callback(err);
				else{
					counts.push({date: date, value: users.length});
					callback();
				}
			});
		},function(err){
				if(err){ console.log(err); callbackGeneral(0);}
				else callbackGeneral(counts);
		});
	},
	getUserByWeek : function(callbackGeneral){
		var today = moment();
		var dates = [];
		dates.push(today.format("YYYY-MM-DD"));
		var counts = [];
		for(var i=0; i<11; i++){
			dates.push(today.subtract(1,'Day').format("YYYY-MM-DD"));
		}
		async.each(dates,function(date,callback){
			User.find({createdAt: {'>=': date, '<': moment(date).add(1,'Day').format("YYYY-MM-DD")}},function(err,users){
				if(err) {console.log(err); callback(err);}
				else{
					counts.push({date: date, value: users.length});
					callback();
				}
			});
		},function(err){
				if(err) callbackGeneral(0);
				else callbackGeneral(counts);
		});
	},

	getUsersData: function(callbackGeneral){
		var shrinkUsers = function(users){
  			return _.map(users, function(obj) { return _.pick(obj, 'first_name','last_name' , 'id', 'createdAt', 'nb_connection','facebook_id','email'); });
		};
		var data = [];
		User.find(function(err,users){
			users = shrinkUsers(users);
			async.eachLimit(users,50,function(user,callback){
				var userData = user;
				Player.query("SELECT COUNT(*) FROM player p WHERE p.user = "+user.id,function(err,nb){
					if(err) callback(err);
					else{ userData.played_foot = nb.rows[0]['count'];
						Player.query("SELECT COUNT(*) FROM player p WHERE p.user = "+user.id+" AND statut = 3",function(err,nb){
							if(err) callback(err);
							else{ userData.created_foot = nb.rows[0]['count'];
								Connexion.findOne({user: user.id},function(err,connection){
									if(err) callback(err);
									else {
										if(connection) userData.connexion = true;
										else userData.connexion = false;
										data.push(userData);
										callback();
									}
								});
							}
						});
					}
				});
			},function(err){
				if(err){console.log(err); callbackGeneral(0);}
				else callbackGeneral(data);
			});
		});
	},

	getFootsData: function(callbackGeneral){
		var shrinkFoots = function(foots){
  			return _.map(foots, function(obj) { return _.pick(obj, 'id', 'createdAt', 'nb_player','field','email','date'); });
		};
		var data = [];
		Foot.find(function(err,foots){
			foots = shrinkFoots(foots);
			async.eachLimit(foots,50,function(foot,callback){
				var footData = foot;
				Field.findOne({id: foot.field},function(err,field){
					if(err) callback(err);
					else if(field) footData.fieldName = field.name;
					data.push(footData);
					callback();
				});
			},function(err){
				if(err){ console.log(err); callbackGeneral(0);}
				else callbackGeneral(data);
			});
		});
	},

	getResasData: function(callbackGeneral){
		var data = [];
		Reservation.find(function(err,resas){
			async.eachLimit(resas,50,function(resa,callback){
				var resaData = resa;
				Field.findOne({id: resa.field},function(err,field){
					if(err) callback(err);
					else if(field) resaData.fieldName = field.name;
					data.push(resaData);
					callback();
				});
			},function(err){
				if(err){ console.log(err); callbackGeneral(0);}
				else callbackGeneral(data);
			});
		});
	},

	getPaiementData: function(callbackGeneral){
		var data = [];
		var labels = [{color: 'primary', mess: 'En attente'},{color:'success', mess:'Réglé à WF'},{color:'warning', mess:'Reglé au centre'},{color:'danger', mess:'Problème'},{color:'primary',mess:'Erreur'}];
		var url = path.join(__dirname,'../../comis.json');
		var coms = fs.readFileSync(url);
		coms = JSON.parse(coms);
		Paiement.find(function(err,resas){
			async.eachLimit(resas,50,function(resa,callback){
				var resaData = resa;
				resaData.labels = labels[4] //default
				Field.findOne({id: resa.field},function(err,field){
					if(err) callback(err);
					else if(field) resaData.fieldName = field.name+ " "+ field.telephone;
					User.findOne({mangoId: resa.user},function(err,user){
						if(err) callback(err);
						else if(user) resaData.userInfos = user.first_name+" "+user.last_name+" "+user.telephone;
						Foot.findOne({id: resa.foot},function(err,foot){
							if(err) callback(err);
							else if(foot){
								if(moment(foot.date)>moment())
									resaData.statut = 0;
								else
									resaData.statut = 2;
								if(resa.paid)
									resaData.statut = 1
								resaData.dateMatch = foot.date;
								if(resa.alert)
									resaData.statut = 3;
								resaData.labels = labels[resaData.statut];
								resaData.com = Math.round(AdminServices.findCommission(coms,resa.field,foot.date)*resa.price*100)/100;
							}
							data.push(resaData);
							callback();
						});
					});
				});
			},function(err){
				if(err){ console.log(err); callbackGeneral(0);}
				else callbackGeneral(data);
			});
		});
	},

	addPartner: function(req,callbackGeneral){
		var fields = [];
		var promos = [];
		for(var i=0; i<parseInt(req.param('nbIndoor')); i++){
			fields.push({field: req.param('fieldId'),  indoor: true,  prix: req.param('prixIndoor')});
		}
		for(var i=0; i<parseInt(req.param('nbOutdoor')); i++){
			fields.push({field: req.param('fieldId'),  indoor: false,  prix: req.param('prixOutdoor')});
		}
		var url = path.join(__dirname,'../../comis.json');
		fs.readFile(url,function(err,data){
			var data = JSON.parse(data);

			data[req.param('fieldId').toString()] = JSON.parse(req.param('comis'));
			fs.writeFile(url, JSON.stringify(data),function(err){
				if(err) console.log(err);
			});
		});
		Field.update(req.param('fieldId'), {partner : true, api_ref: 'classic'},function(err){if(err) console.log(err);});
		async.each(fields,function(field,callback){
			Terrain.create(field,function(err,terrain){
				if(err) {console.log(err); callback()}
				else{
					for(var j=1; j<=3; j++){
						if(req.param('day'+j) && req.param('day'+j).length>0){
							var days = req.param('day'+j);
							var obj = {};
							obj.repetitions = 1;
							obj.terrain = terrain.id;
							if(terrain.indoor) var price = req.param('prixIndoor'+j);
							else var price = req.param('prixOutdoor'+j);
							obj.promo = price/parseFloat(terrain.prix);
							obj.promo = parseFloat(obj.promo);


							for(var i = 0; i<days.length; i++){
								obj.repetitions*= days[i];
							}
							obj.repetitions += '';
						
							var heureDebut = req.param('time'+j+'Start');
							var heureFin = req.param('time'+j+'End');
							obj.heureDebut = moment().set({'hour': parseInt(heureDebut.substring(0,heureDebut.indexOf(':'))),
															 'minute': parseInt(heureDebut.substring(heureDebut.indexOf(':')+1,heureDebut.length)),
															 'second': 00}).format();
							obj.heureFin = moment().set({'hour': parseInt(heureFin.substring(0,heureFin.indexOf(':'))),
															 'minute': parseInt(heureFin.substring(heureFin.indexOf(':')+1,heureFin.length)),
															 'second': 00}).format();
							Promotion.create(obj,function(err){
								if(err) console.log(err);;
							});
						}
					}
					callback();
				}
			});
		},function(err){
				if(err) callbackGeneral(err);
				else callbackGeneral();
		});
	},

	findCommission : function(coms,field,date){
		var comField = coms[field+''];
		if(comField){
			var hours = moment(date).hours();
			var val;
			if(hours<= 2)
				val = "soir";
			else if(hours<=11)
				val = "matin";
			else if(hours<=13)
				val = "midi";
			else if(hours<=17)
				val = "aprem";
			else 
				val = "soir";
			var com = comField[new Date(date).getDay()][val];
			console.log(com);
		}
		else com='ERROR';
		return com;
	}

	// getMapData: function(callbackGeneral){
	// 	var shrinkUsers = function(users){
 //  			return _.map(users, function(obj) { return _.pick(obj, 'first_name','last_name' , 'id', 'createdAt', 'nb_connection','facebook_id','email'); });
	// 	};
	// 	var data = {};
	// 	User.find(function(err,user){
	// 		if(err) callbackGeneral(0);
	// 		else(data.users = _.pluck(users, 'lat'))
	// 	})
	// }
}