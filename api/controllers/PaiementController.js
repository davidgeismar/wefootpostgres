module.exports = {

	getCards: function (req,res) {   //Make it strongly secure
		try{
			PaiementService.getCards(req.param('user'),function(cards){
				if(cards===0){
					PaiementService.register(req.param('user'), function(user){
						 res.status(200).json([[],user]);
					});
				}
				else if(cards.length==0)
					res.status(200).json([[],req.param('user')]);
				else
					res.status(200).json([cards,req.param('user')]);
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
		PaiementService.preauthorize(req.param('mangoId'),req.param('price'),req.param('cardId'),req.param('footId'),function(elem){
			console.log(elem);
			if(elem === 0) return res.status(400).end();
			res.status(200).json(elem);
		});
	},

	transferMoney: function(req,res){
		PaiementService.payin(req.param('foot'),req.param('secret'),function(elem){
			if(elem ===0) return res.status(400).end();
			res.status(200).end();
		});
	}

}