module.exports = {

	update:function(req,res){
		PaiementService.verify(req,function(val){
			if(val){
				Paiement.update({foot: req.param('id')},req.params.all(),function(err,paiement){
					if(err) res.status(400).end();
					else res.status(200).end();
				});
			}
			else
				res.status(406).end();
		});	
	},

	getCards: function (req,res) {   //Make it strongly secure
		try{
			PaiementService.getCards(req.param('user'),function(cards,user){
				if(cards===0){
					PaiementService.register(user, function(user){
						 res.status(200).json([[],user]);
					});
				}
				else if(cards.length==0)
					res.status(200).json([[], user]);
				else
					res.status(200).json([cards, user]);
			});
		}
		catch(err){
				console.log(err);
				return res.status(400).end();
		}	
	},

	registerCard: function(req,res){
			PaiementService.submitCard(req.param('user'),req.param('info'),function(card){
				if(card === 0) return res.status(400).end();
				else res.status(200).json(card);
			});
	},

	preauthorize: function(req,res){
		PaiementService.preauthorize(req.param('mangoId'),req.param('price'),req.param('cardId'),req.param('footId'),req.param('field'),function(elem){
			if(elem === 0) return res.status(400).end();
			res.status(200).json(elem);
		});
	},

	transferMoney: function(req,res){
		PaiementService.verify(req,function(val){
			if(val){
				PaiementService.payin(req.param('foot'),req.param('secret'),function(elem){
					if(elem ===0) return res.status(400).end();
					res.status(200).end();
				});
			}
			else
				res.status(406).end();
		});
	}
}