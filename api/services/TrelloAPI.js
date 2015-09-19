var Trello = require("trello");
var trello = new Trello("2bfac14562af1aea049d11642d2f813d", "7fd1518332ca249530bfaff65e7bd06861ff5034aedf47cc554a3cb7a04b94aa");

module.exports = {
	//GET TOKEN
	// https://trello.com/1/authorize?key=2bfac14562af1aea049d11642d2f813d&name=My+Application&expiration=60days&response_type=token&scope=read,write
	// GET LIST ID
	// https://api.trello.com/1/boards/QOih1x4s/lists?cards=open&card_fields=name&fields=name&key=2bfac14562af1aea049d11642d2f813d&token=7fd1518332ca249530bfaff65e7bd06861ff5034aedf47cc554a3cb7a04b94aa
	
	addCard : function(description){
		trello.addCard(description, description, "55fbcfc9f3e75b1d74adcd1c",
			function (error, trelloCard) {
				if (error) {
					// console.log('Could not add card:', error);
				}
				else {
					// console.log('Added card:', trelloCard);
				}
			});
	}
}