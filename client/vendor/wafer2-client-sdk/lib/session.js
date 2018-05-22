var constants = require('./constants');
var SESSION_KEY = 'weapp_session_' + constants.WX_SESSION_MAGIC_ID;

var Session = {
  get: function () {
    console.log('get SESSION_KEY: ' + SESSION_KEY)
    return wx.getStorageSync(SESSION_KEY) || null;
  },

  set: function (session) {
    console.log('set SESSION_KEY: ' + SESSION_KEY)
    wx.setStorageSync(SESSION_KEY, session);
  },

  clear: function () {
    console.log('remove set SESSION_KEY: ' + SESSION_KEY)
    wx.removeStorageSync(SESSION_KEY);
  },
};

module.exports = Session;