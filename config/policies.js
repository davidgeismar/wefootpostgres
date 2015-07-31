/**
 * Policy Mappings
 * (sails.config.policies)
 *
 * Policies are simple functions which run **before** your controllers.
 * You can apply one or more policies to a given controller, or protect
 * its actions individually.
 *
 * Any policy file (e.g. `api/policies/authenticated.js`) can be accessed
 * below by its filename, minus the extension, (e.g. "authenticated")
 *
 * For more information on how policies work, see:
 * http://sailsjs.org/#/documentation/concepts/Policies
 *
 * For more information on configuring policies, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.policies.html
 */


module.exports.policies = {

  /***************************************************************************
  *                                                                          *
  * Default policy for all controllers and actions (`true` allows public     *
  * access)                                                                  *
  *                                                                          *
  ***************************************************************************/

  // '*': true,

  /***************************************************************************
  *                                                                          *
  * Here's an example of mapping some policies to run before a controller    *
  * and its actions                                                          *
  *                                                                          *
  ***************************************************************************/
  // RabbitController: {

    // Apply the `false` policy as the default for all of RabbitController's actions
    // (`false` prevents all access, which ensures that nothing bad happens to our rabbits)
    // '*': false,

    // For the action `nurture`, apply the 'isRabbitMother' policy
    // (this overrides `false` above)
    // nurture  : 'isRabbitMother',

    // Apply the `isNiceToAnimals` AND `hasRabbitFood` policies
    // before letting any users feed our rabbits
    // feed : ['isNiceToAnimals', 'hasRabbitFood']
  // }

  '*':'isLoggedIn',

  ActuController: {
    getNotif: 'isLoggedInParam(\'id\')',
    // getActu,
    // newNotif
  },
  AdminController:{
    // index
    // login
    // dashboard
    // tables
    // resas
    // map
    // notify
    // sendNotif
    // partner
  },

  ChatController:{
    // create
    // getChat
    getAllChats: 'isLoggedInParam(\'id\')',
    getNewChats: 'isLoggedInParam(\'id\')',
    // getNewChatters
    getUnseenMessages:'isLoggedInParam(\'id\')',
  },
  ChatterController:{
    updateLts: 'isLoggedInParam(\'user\')',
    // addToChat
    deactivateFromChat: 'isLoggedInParam(\'user\')'
  },
  ConnexionController:{
    setSocket: 'isLoggedInParam(\'id\')'
    // delete
  },  
  FieldController:{
    // create
    // uploadPic
    // searchFields
    // getAllFields
  },
  FootController:{
    create: 'isLoggedInParam(\'created_by\')',
    update:'isFootOwner',
    getFootByUser:'isLoggedInParam(\'player\')',
    // getInfo
    // getPlayers
    updatePlayer:'isLoggedInParam(\'user\')',
    // getAllPlayers
    // sendInvits
    removePlayer: 'isFootOwner',
    refusePlayer: 'isFootOwner',
    deleteFoot: 'isFootOwner',
    // query
    askToPlay:'isLoggedInParam(\'user\')',
  },
  FriendshipController:{
  deleteFriend: 'isLoggedInParams(\'user1\', \'user2\')'
  },

  MessageController:{
    create: 'isLoggedInParam(\'sender_id\')',
  },

  NotationContoller:{
    // getGrade
    grade:'isLoggedInParam(\'noteur\')',
    // getDetailledGrades
  },

  PaiementController:{
    // update
    getCards:'isLoggedInParam(\'user\')',
    registerCard:'isLoggedInParam(\'user\')',
    preauthorize:'mangoCheck'
    // transferMoney
  },
  PushController:{
    // create:'isLoggedInParam(\'user\')'
  },
  ReservationController:{
    // getTerrainsFree:isFootOwner
    // create
    // google_calender_getAuth
    // google_calender_getToken
  },

  UserController: {
    facebookConnect: true,
    create: true,
    update:'isLoggedInParam(\'id\')',
    // get
    // getWholeUser
    // profil
    // uploadProfilPic
    // search
    addFriend:'isLoggedInParams(\'user1\', \'user2\')',
    getAllFriends:'isLoggedInParam(\'id\')',
    addFavorite:'isLoggedInParams(\'id1\', \'id2\')',
    removeFavorite:'isLoggedInParams(\'id1\', \'id2\')',
    newPassword:true,
    resetPassword:true,
    updateSeen:'isLoggedInParam(\'id\')',
    getLastNotif:'isLoggedInParam(\'id\')'
    // toConfirm

  },
  TropheController:{
    // getNbTrophes
  },
  SessionController: {
    login: true
    // isConnected
  },


};
