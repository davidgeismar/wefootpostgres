/**
 * AdminController
 *
 * @description :: Server-side logic for managing admins
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

module.exports = {
	
	index: function(req,res){
		if(req.session.user && req.session.user.id)
			res.redirect('admin/dashboard/'+req.session.user.id)
		else{
			res.locals.flash = _.clone(req.session.flash);
			res.view('admin/signin');
			req.session.flash = {};
		}
	},

	login: function(req,res) {
		Admin.findOne({name: req.param('name')}, function(err,admin){
			if(err){ req.session.flash = {err: 'Erreur lors de la requête'};
			res.redirect('/admin');
			}
			else if(!admin){ req.session.flash = {err: 'Le nom entré est inconnu'}; res.redirect('/admin');}
			else if(admin.password != req.param('password')){ req.session.flash = {err: 'Mot de passe incorrect'}; res.redirect('/admin');}
			else{
				req.session.admin = admin;
				res.redirect('admin/dashboard/'+admin.id);
			}
		});
	},

	dashboard: function(req,res){
		if(!req.session.admin)
			res.redirect('/admin');
		else{
			AdminServices.getNumbers(function(counters){
				AdminServices.getEarningsByDay(function(data){
					AdminServices.getUserByMonth(function(usersMonth){
						AdminServices.getUserByWeek(function(usersWeek){
							res.view({admin: req.session.admin, usersMonth: _.sortBy(usersMonth,'date'), usersWeek: _.sortBy(usersWeek,'date'), earningDay:  _.sortBy(data,'date'), figures: counters, moment: require('moment'),layout:'admin/layout-admin.ejs'});
						});
					});
				});
			});
		}
	},

	tables: function(req,res){
		if(!req.session.admin)
			res.redirect('/admin');
		else{
			AdminServices.getUsersData(function(users){
				AdminServices.getFootsData(function(foots){
					AdminServices.getResasData(function(resas){
						res.view({admin: req.session.admin,layout:'admin/layout-admin.ejs',users:users, foots: foots,resas: resas, moment: require('moment')});
					});
				});
			});
		}
	},

	resas: function(req,res){
		if(!req.session.admin)
			res.redirect('/admin');
		else{
			AdminServices.getPaiementData(function(resas){
				res.view({admin: req.session.admin,layout:'admin/layout-admin.ejs', moment: require('moment'), resas: resas });
			})
		}
	},

	map: function(req,res){
		if(!req.session.admin)
			res.redirect('/admin');
		else{
			res.view({admin: req.session.admin,layout:'admin/layout-admin.ejs'});		
		}
	},

	notify: function(req,res){
		if(!req.session.admin)
			res.redirect('/admin');
		else{
			res.view({admin: req.session.admin,layout:'admin/layout-admin.ejs'});		
		}
	},

	sendNotif: function(req,res){
		if(req.param('pushTexte') && req.param('pushTexte').length>0 && req.session.admin.id){	
			Push.find(function(err,push){
				if(err) res.status(400).end();
				else PushService.sendPush(push, req.param('pushTexte'));
				res.redirect('/admin/dashboard/'+req.session.admin.id);
			});
		}
		if(req.param('actuTexte') && req.param('actuTexte') && req.session.admin.id){
			Actu.create({typ:'WF', attached_text: req.param('actuTexte')},function(err,actu){
				if(err) res.status(400).end();
			});
		}
		if(!req.session.admin.id)
			res.status(403).end(); 
	},

	partner: function(req,res){
		if(!req.session.admin)
			res.redirect('/admin');
		else{
			res.view({admin: req.session.admin,layout:'admin/layout-admin.ejs'});		
		}
	},

	addPartner: function(req,res){
		if(req.session.admin && req.session.admin.id){
			AdminServices.addPartner(req,function(err){
				if(err){
					res.redirect('/admin/partner'); 
				} 
				res.redirect('/admin/dashboard/'+req.session.admin.id);
			});
		}
		else 
			res.status(403).end();
	}

};

