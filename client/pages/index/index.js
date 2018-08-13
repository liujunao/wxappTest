// pages/main/index/index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    text: '从相机中选择',
    imgUrl: '',
    //摄像头为前置还是后置
    device: 'back',
    //设置摄像头是否打开 
    cameraOn: true,
    //设置选用什么识别方式
    indexSet: '',
    //盲人昵称、openid、微信头像
    nickName: '',
    openId: '',
    avatarUrl: '',
    filePath: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onShow: function () {
    this.setData({
      cameraOn: true
    })
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.setData({
      cameraOn: false
    })
  },

  onLoad: function (options){
    wx.setNavigationBarTitle({
      title: '我是你的眼主页面',
    })
    this.setData({
      indexSet: ''
    })
    if(options.tmp){
      this.doUpload();
    }
  },

  //视频求助接口
  videoHelp: function(){
    util.showModel('提示','该功能正在开发，敬请期待')
  },

  //拍照接口
  takePhoto: function () {
    let that = this;
    const ctx = wx.createCameraContext();
    ctx.takePhoto({
      quality: 'high',
      success: (res) => {
        this.setData({
          filePath: res.tempImagePath,
        });
        var filePath = res.tempImagePath
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',
          success: function (res) {
            util.showSuccess('上传图片成功')
            res = JSON.parse(res.data)
            that.setData({
              imgUrl: res.data.imgUrl
            })
            wx.setStorage({
              key: "imgUrl",
              data: res.data.imgUrl
            })
          },

          fail: function (e) {
            console.error(e)
          }
        })
        wx.navigateTo({
          url: '../chat/chat?imgUrl=' + res.tempImagePath + '&indexSet=' + that.data.indexSet,
        })
      }
    });
  },

  //用户不允许使用摄像头时触发
  error(e) {
  },

  // 上传图片接口
  doUpload: function () {
    var that = this;
    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        //跳转到聊天室页面
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',
          success: function (res) {
            util.showSuccess('上传图片成功')
            res = JSON.parse(res.data)
            console.log(res)
            that.setData({
              imgUrl: res.data.imgUrl
            })
            wx.setStorage({
              key: "imgUrl",
              data: res.data.imgUrl
            })
          },

          fail: function (e) {
            console.error(e)
          }
        })
        
        //console.log(res)
        wx.navigateTo({
          url: '../chat/chat?imgUrl=' + filePath + '&indexSet=' + that.data.indexSet,
        })
      },
      fail: function (e) {
        console.error(e)
      }
    })
  },

  // 预览图片
  previewImg: function () {
    wx.previewImage({
      current: this.data.imgUrl,
      urls: [this.data.imgUrl]
    })
  },

  //转到我的页面
  toMine: function () {
    wx.navigateTo({
      url: '../mine/mine',
    })
  },

  //切换摄像头
  checkDevice: function () {
    if (this.data.device == 'back') {
      this.setData({
        device: 'front'
      })
    } else if (this.data.device == 'front') {
      this.setData({
        device: 'back'
      })
    }
  },

  indexSet1: function(){
    this.setData({
      indexSet: 'indexSet1_ocr'
    })
  },
  indexSet2:function(){
    this.setData({
      indexSet: 'indexSet2_rec'
    })
  },
  indexSet3:function(){
    this.setData({
      indexSet: 'indexSet3_con'
    })
  },
  //吐个槽客服系统接入
  tucao: function(){
    console.log('tucao')
    wx.navigateToMiniProgram({
      appId: 'wx8abaf00ee8c3202e',
      // 目标为吐个槽社区小程序AppID(固定)
      path: "/pages/index-v2/index-v2",
      extraData: {
        id: config.tucao.id,  // 来源为吐个槽上申请的产品ID ，查看路径：tucao.qq.com ->产品管理->ID
        customData: {
          clientInfo: '',
          imei: ''
        }
      }
    });
  }

})
