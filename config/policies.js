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


  '*':'isLoggedIn',

  ActuController: {
    getNotif: 'isLoggedInParam(\'id\')',
    // getActu,
    // newNotif
  },
  AdminController:{
    '*':true
    // ,
    // index:true,
    // login:true,


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
    getFieldInfo: true,
    getAllFields: true,
    deletePrivateField: 'isLoggedInParam(\'related_to\')'
  },
  FootController:{
    create: 'isLoggedInParam(\'created_by\')',
    update:'isFootOwnerParam(\'id\')',
    getFootByUser:'isLoggedInParam(\'player\')',
    // getInfo
    // getPlayers
    // updatePlayer:'isLoggedInParam(\'user\')', TO FIX
    // getAllPlayers
    // sendInvits
    removePlayer: 'isLoggedInParam(\'user\')',
    refusePlayer: 'isFootOwnerParam(\'foot\')',
    deleteFoot: 'isFootOwnerParam(\'foot\')',
    // query
    askToPlay:'isLoggedInParam(\'userId\')',
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
