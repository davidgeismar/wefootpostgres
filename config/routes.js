/**
 * Route Mappings
 * (sails.config.routes)
 *
 * Your routes map URLs to views and controllers.
 *
 * If Sails receives a URL that doesn't match any of the routes below,
 * it will check for matching files (images, scripts, stylesheets, etc.)
 * in your assets directory.  e.g. `http://localhost:1337/images/foo.jpg`
 * might match an image file: `/assets/images/foo.jpg`
 *
 * Finally, if those don't match either, the default 404 handler is triggered.
 * See `api/responses/notFound.js` to adjust your app's 404 logic.
 *
 * Note: Sails doesn't ACTUALLY serve stuff from `assets`-- the default Gruntfile in Sails copies
 * flat files from `assets` to `.tmp/public`.  This allows you to do things like compile LESS or
 * CoffeeScript for the front-end.
 *
 * For more information on configuring custom routes, check out:
 * http://sailsjs.org/#/documentation/concepts/Routes/RouteTargetSyntax.html
 */

 module.exports.routes = {

  /***************************************************************************
  *                                                                          *
  * Make the view located at `views/homepage.ejs` (or `views/homepage.jade`, *
  * etc. depending on your default view engine) your home page.              *
  *                                                                          *
  * (Alternatively, remove this and add an `index.html` file in your         *
  * `assets` directory)                                                      *
  *                                                                          *
  ***************************************************************************/

  '/': {
    view: 'homepage'
  },

  'GET /user/get/:id': 'UserController.get',

  'GET /foot/get/:id': 'FootController.get',

  'GET /search/:word': 'UserController.search',

  'GET /field/searchFields/?id=:id&lat=:lat&long=:long&word=:word': 'FieldController.searchFields',

  'GET /field/getFields/?id=:id&lat=:lat&long=:long':'FieldController.getFields',

  '/addFriend': 'UserController.addFriend',
  
  'GET /getAllFriends/:id/:skip': 'UserController.getAllFriends',

  '/addFavorite': 'UserController.addFavorite',

  '/removeFavorite': 'UserController.removeFavorite',

  'GET /updateData/:start': 'UserController.updateData',

  '/removeFavorite': 'UserController.removeFavorite',

  '/editUser': 'UserController.editUser',

  '/facebookConnect': 'UserController.facebookConnect',

  'GET /getAllChats/:id': 'ChatController.getAllChats',

  'GET /getFootByUser/:player': 'FootController.getFootByUser',

  'GET /getGrade/:noteur/:note': 'NotationController.getGrade',

  'GET /getNotif/:id': 'ActuController.getNotif',

  'GET /getDetailledGrades/:note': 'NotationController.getDetailledGrades',

  'GET /getVoters/:footId' : 'VoteController.getVoters',

  'GET /getChatNotif/:id' :'Chat.getChatNotif',

  '/player/update': 'FootController.updatePlayer',

  'GET /getVotedStatus/:electeur/:footId' : 'VoteController.getVotedStatus',

  'GET /user/toConfirm/:user/:id': 'UserController.toConfirm',

  'GET /chat/getNewChats/:id/:ltu': 'ChatController.getNewChats',

  'GET /chat/getUnseenMessages/:id/:ltu': 'ChatController.getUnseenMessages',

  'GET /chat/getNewChatters/:id/:ltu': 'ChatController.getNewChatters',

  '/pay/registerCard': 'PaiementController.registerCard',

  '/pay/getCards': 'PaiementController.getCards',

  '/pay/preauthorize': 'PaiementController.preauthorize',

  '/pay/transferMoney': 'PaiementController.transferMoney',

  '/chat/getChat/:id/:related' : 'ChatController.getChat',



  // 'GET /getFields/:id' : 'FieldController.getFields'

  /***************************************************************************
  *                                                                          *
  * Custom routes here...                                                    *
  *                                                                          *
  *  If a request to a URL doesn't match any of the custom routes above, it  *
  * is matched against Sails route blueprints. See `config/blueprints.js`    *
  * for configuration options and examples.                                  *
  *                                                                          *
  ***************************************************************************/

};
