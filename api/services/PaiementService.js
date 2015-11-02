var https = require('https');
var bcrypt = require('bcrypt');
var atob = require('atob');

var mango = require('mangopay')({
    username: 'geniusraph',
    password: 'xjR9nxeEo7hXWEWKy8bkQmp7LFGAZLdX7CEzAowouOBoXxRkZC',
    production: false
});

var wfId = 7563503;
var wfWallet = 7563526;
var secret = 'wfGenius1230';

module.exports = {
	

	register: function(user,callback) {
    	mango.user.signup({
      		FirstName: user.first_name, // Required
      		LastName: user.last_name,    // Required
      		Birthday: new Date(user.birthday) / 1000,  // Required
      		Nationality: "FR", // Required, default: 'FR'
     		CountryOfResidence: "FR", // Required, default: 'FR'
      		Email: user.email 
    	}, function(err, wallet){
        	if(err) { console.log(err); callback(0);}
        	else{
        		User.update({id: user.id},{mangoId: parseInt(wallet.Id)},function(err,user){
        			if(err) throw err;
        			callback(user);
        		});
        	}
    	});
	},

	submitCard: function(user,info,callback){
		mango.card.create({
			UserId: user.mangoId,
  			CardNumber: info.number,
  			CardExpirationDate: info.expirationDate,
  			CardCvx: info.cvx
		},function(err,card){
			if(err) callback(0);
			else callback(card);
    	});
	},

	getCards: function(user,callback){
		User.findOne({id: user}, function(err,user){
			if(err) throw err;
			if(!user.mangoId){
				callback(0, user);
				return;
			}
			mango.user.cards({
				UserId: user.mangoId
			},function(err,cards){
				if(err) callback(0, user);
				else callback(cards, user);
			});
		});
	},

	getWallets: function(id,callback){
		User.findOne({id: id}, function(err,user){
			if(err) throw err;
			mango.user.wallets({
				UserId: user.mangoId
			},function(err,cards){
				if(err) callback(0);
				else callback(cards);
			});
		});
	},

	preauthorize: function(mangoId,price,cardId,footId,field,callback){
		mango.author.create({
			AuthorId: mangoId,
			DebitedFunds: {
				Currency: 'USD',
				Amount: parseInt(price)*100
			},
			CardId: cardId,
			SecureMode: 'Default',
			SecureModeReturnURL: 'http://www.wefoot.co' 
		},function(err,preauth){
			console.log(err);
			if(err) return callback(0);
			Paiement.create({user:mangoId,foot: footId, preauth_id: preauth.Id,price: price,field: field},function(err){
				if(err) return callback(0);
				callback();
			});
			Foot.update({id: footId}, {booked: true},function(err){});
		});
	},

//Pay in case of non venue

	payin: function(footId,password,callback){
		Paiement.findOne({foot: footId},function(err,preauth){
			if(err) return callback(0);
			if(!preauth) return callback(0);
			if(password != secret) return callback(0);
			mango.author.capture({
				AuthorId: preauth.user,
				DebitedFunds: {
					Currency: 'USD',
					Amount: parseInt(preauth.price)*100
				},
				Fees: {
					Currency: 'USD',
					Amount: 0
				},
				CreditedWalletId: wfWallet,
				PreauthorizationId: preauth.preauth_id
			},function(err,result){
				if(err) callback(0);
				else callback();
			});
		});
	},

	verify: function(req,callback){
		if(!req.headers['authorization']) var string= " ";//Prevents from 500
		else var string = atob(req.headers['authorization']);
		var admin = {name: string.substring(0,string.indexOf(':')), password: string.substring(string.indexOf(':')+1,string.length)};
		if(admin){
			Admin.findOne({name: admin.name},function(err,user){
				if(err || !admin || !user) callback(false);
				else if(admin.password == user.password) 
					callback(true);
				else
					callback(false);
			});
		}
		else callback(false);
	}

}