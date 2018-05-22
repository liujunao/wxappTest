// vendor/modelMsg/modelMsg.js

var config = require('../../config')

Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },

  //获取 token
  getToken: function () {
    wx.request({
      url: config.service.model,
      method: 'GET',
      success: function (res) {
        console.log(JSON.stringify(res))
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  //获取 token
  getToken2: function () {
    wx.request({
      url: 'https://api.weixin.qq.com/cgi-bin/token',
      method: 'GET',
      data:{
        grant_type: 'client_credential',
        appid: 'wx256af4f2c0d2ea39',
        secret: '2523bb6dc78b06158259c4203a4b5260'
      },
      success: function (res) {
        console.log(JSON.stringify(res))
      },
      fail: function (err) {
        console.log(err)
      }
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})