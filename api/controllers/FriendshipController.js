 module.exports = {


 	deleteFriend: function(req,res){
 		Friendship.destroy({user1:req.param('user1'), user2:req.param('user2')}).exec(function(err, friendship){
 			console.log(err);
 			if(err)
 				return res.status(400).end();
 			return res.status(200).end();
 		})
 	}




 };