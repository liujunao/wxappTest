// pages/main/picture/picture.js

var qcloud = require('../../vendor/wafer2-client-sdk/index')
var config = require('../../config')
var util = require('../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 身份证识别
    imgUrl: '',
    idCardInfo: {},
    showResult: false,

    // 印刷体识别
    ocrImgUrl: '',
    ocrResult: [],
    showOcrResult: false,

    //营业执照识别
    busImgUrl: '',
    busResult: [],
    showBusResult: false,

    //名片识别
    idImgUrl: '',
    idInfo: [],
    showidResult: false,

    //识别图片内容信息，并以标签的形式显示
    conImgUrl: '',
    conResult: [],
    showConResult: false,

    //看图说话
    picImgUrl: '',
    picResult: {},
    showPicResult: false,

  },

  // 上传图片接口
  doUpload: function () {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在上传')
        var filePath = res.tempFilePaths[0]
        console.log('tempFilePaths: ' + filePath)
        // 上传图片
        wx.uploadFile({
          url: config.service.uploadUrl,
          filePath: filePath,
          name: 'file',

          success: function (res) {
            util.showSuccess('上传图片成功')
            console.log(res)
            res = JSON.parse(res.data)
            that.setData({
              imgUrl: res.data.imgUrl
            })
          },

          fail: function (e) {
            util.showModel('上传图片失败')
          }
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

  //印刷体识别
  doWordIndentify: function () {
    var that = this

    that.setData({
      showOcrResult: true
    })

    // 选择图片和上传图片
    this._chooseImgAndUpload(
      // 上传图片之前
      function (filePath) {
        that.setData({
          ocrImgUrl: filePath
        })
      },

      config.service.ciUrl + '?action=general',
      //config.service.uploadUrl,
      // 调用成功
      function (res) {
        util.showSuccess('识别成功')
        console.log('res: ' + res);
        var data = JSON.parse(res.data)
        if (data.code !== 0) {
          util.showModel('识别失败')
          return
        }
        var info = data.data
        if (info.code !== 0) {
          util.showModel('识别失败' + info.message)
          return
        }
        that.setData({
          showOcrResult: true,
          ocrResult: info.data.items
        })
      },
      // 调用失败
      function (e) {
        console.log(e)
        util.showModel('识别失败' + e.message)
      }
    )
  },
  //身份证识别
  doIdCardIdentify: function () {
    var that = this
    that.setData({
      showResult: false
    })

    // 选择图片和上传图片
    this._chooseImgAndUpload(
      // 上传图片之前
      function (filePath) {
        that.setData({
          imgUrl: filePath
        })
      },
      config.service.ciUrl + '?action=idcard',
      // 调用成功
      function (res) {
        util.showSuccess('识别成功')
        var data = JSON.parse(res.data)

        if (data.code !== 0) {
          util.showModel('识别失败')
          return
        }

        var info = data.data[0]

        if (info.code !== 0) {
          util.showModel('识别失败' + info.message)
          return
        }

        that.setData({
          showResult: true,
          idCardInfo: info.data
        })
      },
      // 调用失败
      function (e) {
        util.showModel('识别失败' + e.message)
      }
    )
  },
  //营业执照识别
  doBusinessLicense: function () {
    var that = this

    that.setData({
      showBusResult: false
    })

    //选择和上传图片
    this._chooseImgAndUpload(
      //上传图片之前
      function (filePath) {
        that.setData({
          busImgUrl: filePath
        })
      },

      config.service.ciUrl + '?action=busCard',

      //调用成功
      function (res) {
        util.showSuccess('识别成功！')
        var data = JSON.parse(res.data)

        if (data.code !== 0) {
          util.showModel('识别失败！')
          return
        }

        if (info.code !== 0) {
          util.showModel('识别失败' + info.message)
          return
        }

        var info = data.data

        that.setData({
          showBusResult: true,
          busResult: info.data.items
        })
      },
      //调用失败
      function (e) {
        console.log(e)
        util.showModel('识别失败' + e.message)
      }
    )
  },
  //名片识别
  doIdIndentify: function () {
    var that = this

    that.setData({
      showidResult: false
    })

    // 选择图片和上传图片
    this._chooseImgAndUpload(
      // 上传图片之前
      function (filePath) {
        that.setData({
          idImgUrl: filePath
        })
      },

      config.service.ciUrl + '?action=idName',

      // 调用成功
      function (res) {
        util.showSuccess('识别成功')
        console.log(res.data)
        var data = JSON.parse(res.data)

        if (data.code !== 0) {
          util.showModel('识别失败')
          return
        }

        var info = data.data[0]
        console.log('data: ' + info)

        if (info.code !== 0) {
          util.showModel('识别失败' + info.message)
          return
        }

        that.setData({
          showidResult: true,
          idInfo: info.data
        })
      },
      // 调用失败
      function (e) {
        util.showModel('识别失败' + e.message)
      }
    )
  },
  //识别图片内容信息，并以标签的形式显示
  doConIndentity: function () {
    var that = this

    that.setData({
      showConResult: true
    })

    // 选择图片和上传图片
    this._chooseImgAndUpload(
      // 上传图片之前
      function (filePath) {
        that.setData({
          conImgUrl: filePath
        })
      },

      config.service.ciUrl + '?action=idContent',

      // 调用成功
      function (res) {
        util.showSuccess('识别成功')
        console.log('res: ' + res.data)
        var data = JSON.parse(res.data)

        if (data.code !== 0) {
          util.showModel('识别失败')
          return
        }
        var info = data.data
        if (info.code !== 0) {
          util.showModel('识别失败' + info.message)
          return
        }

        that.setData({
          showConResult: true,
          conResult: info.tags
        })
      },
      // 调用失败
      function (e) {
        console.log(e)
        util.showModel('识别失败' + e.message)
      }
    )
  },
  //看图说话测试
  picToSpeech: function () {
    var that = this

    that.setData({
      showPicResult: false
    })
    // 选择图片和上传图片
    this._chooseImgAndUpload(

      // 上传图片之前
      function (filePath) {
        that.setData({
          picImgUrl: filePath,
        })
      },
      config.service.ciUrl + '?action=picSpeech',

      // 调用成功
      function (res) {
        util.showSuccess('识别成功')
        var data = JSON.parse(res.data)
        console.log('data: ' + JSON.stringify(data));
        if (data.code !== 0) {
          util.showModel('识别失败')
          return
        }
        var info = data.data
        if (info.ret !== 0) {
          util.showModel('识别失败' + info.msg);
          return
        }

        that.setData({
          showPicResult: true,
          picResult: info.data
        })
      },
      // 调用失败
      function (e) {
        console.log('err: ' + e)
        // util.showModel('识别失败' + e.msg)
      }
    )
  },

  /**
   * 统一封装选择图片和上传图片的 API
   * @param {Function} beforUpload 开始上传图片之前执行的函数
   * @param {Function} success     调用成功时执行的函数
   * @param {Function} fail        调用失败时执行的函数
   */
  _chooseImgAndUpload(beforUpload, url, success, fail) {
    var that = this

    // 选择图片
    wx.chooseImage({
      count: 1,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        util.showBusy('正在识别')
        var filePath = res.tempFilePaths[0]
        beforUpload(filePath)
        // 上传图片
        wx.uploadFile({
          url: url,
          filePath: filePath,
          name: 'file',
          success: success,
          fail: fail
        })
      },
      fail: fail
    })
  },

})