/**
 * BugReportController
 *
 * @description :: Server-side logic for managing Bugreports
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Controllers
 */

 module.exports = {

 	addCard : function(req,res){
 		TrelloAPI.addCard(req.param('bug'));
 		res.status(200).end();
 	}
 };

