//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');

var app = getApp();
var that;
//要发送的对话列表
var chatListData = [];
var speakerInterval;
var indexSet;

Page({
  data: {
    defaultCorpus: '你都会什么',
    //用户的输入
    askWord: '',
    //是否发送信息,true 为不发送
    sendButtDisable: true,
    userInfo: {},
    //
    chatList: [],
    //scroll-into-view属性：值应为某子元素id（id不能以数字开头）。设置哪个方向可滚动，则在哪个方向滚动到该元素
    scrolltop: '',
    userLogoUrl: '../image/user_default.png',
    keyboard: true,

    //是否正在语音输入
    isSpeaking: false,
    speakerUrl: '../image/speaker0.png',
    //语音输入时的麦克风帧动画图片前缀
    speakerUrlPrefix: '../image/speaker',
    //语音输入时的麦克风帧动画图片后缀
    speakerUrlSuffix: '.png',
    //录音文件地址
    filePath: null,
    contactFlag: true,
    imgUrl: "",

    /////////
    caremaImg: '../image/camera.png',
    picImg: '../image/album.png',
    ocrImg: '../image/ocr.png',
    conImg: '../image/content.png',
    descImg: '../image/describe.png',
    mineIng: '../image/mine.png',

    // 印刷体识别
    ocrImgUrl: '',
    ocrResult: [],
    //识别图片内容信息，并以标签的形式显示
    conImgUrl: '',
    conResult: [],
    //图片描述识别

    //语音合成
    recordUrl: '',
    showRecord: false,

    textRec: '',
    voice: '',

    //求助志愿者
    inputValue: '',
    nickName: '',
    openId: '',
    avatarUrl: '',
  },

  onLoad: function (options) {
    that = this;
    indexSet = options.indexSet;
    app.getUserInfo(function (userInfo) {
      var aUrl = userInfo.avatarUrl;
      if (aUrl != null) {
        that.setData({
          userLogoUrl: aUrl,
          imgUrl: options.imgUrl,
        });
      }
    });
    that.addChat(options.imgUrl, 'p');
    //自动进行内容识别
    util.showCon()
    setTimeout(function(){
      let AIRes = wx.getStorageSync('AiRes')
      console.log('chat: ' + AIRes)
      that.addChat(AIRes, 'l')
    },500)
    
    if (indexSet) {
      if (indexSet == 'indexSet1_ocr') {
        that.doWordIndentify();
      } else if (indexSet == 'indexSet2_rec') {
        that.doTxtToRecord();
      } else if (indexSet == 'indexSet3_con') {
        that.doConIndentity();
      }
    }
  },

  //打开相机,实际是回到主页面
  openCamera: function () {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  // 选择图片
  checkPic: function () {
    wx.reLaunch({
      url: '../index/index?tmp=picTmp',
    })
  },

  //文字转语音;并未实现
  textToSpeech: function () {
    wx.request({
      url: config.service.ciUrl,
      data: {
        text: "this.data.ocrResult"
      },
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        console.log('textToSpeech: ' + JSON.stringify(res));
      }
    })
  },

  //印刷体识别
  doWordIndentify: function () {
    let that = this
    that.addChat('印刷体识别', 'a');
    let img = wx.getStorageSync('imgUrl')
    wx.request({
      url: config.service.ciUrl,
      data: {
        'action': 'general',
        'imgUrl': img
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        util.showSuccess('识别成功')
        var data = res.data
        if (data.code !== 0) {
          util.showModel('识别失败', '请检查网络状态或更换识别方式')
          return
        }
        var info = data.data
        if (info.code !== 0) {
          util.showModel('识别失败', '请检查网络状态或更换识别方式')
          return
        }

        that.setData({
          ocrResult: info.data.items
        })
        let des = that.data.ocrResult
        let tmp = []
        for (let i = 0; i < des.length; i++) {
          tmp.push(des[i].itemstring)
        }
        that.addChat(tmp, 'l');
      },
      fail: function (res) {
        console.log(e)
        util.showModel('识别失败', '请检查网络状态或更换识别方式')
      }
    })
  },

  //识别图片内容信息，并以标签的形式显示
  doConIndentity: function () {
    var that = this
    that.addChat('图片标签识别', 'a');
    let img = wx.getStorageSync('imgUrl')
    wx.request({
      url: config.service.ciUrl,
      data: {
        'action': 'idContent',
        'imgUrl': img
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        util.showSuccess('识别成功')
        // var data = JSON.parse(res.data)
        var data = res.data
        if (data.code !== 0) {
          util.showModel('识别失败', '请检查网络状态或更换识别方式')
          return
        }
        var info = data.data
        if (info.code !== 0) {
          util.showModel('识别失败', '请检查网络状态或更换识别方式')
          return
        }

        that.setData({
          conResult: info.tags
        })
        let des = that.data.conResult
        let tmp = []
        for (let i = 0; i < des.length; i++) {
          let con = des[i].tag_name + "正确率为百分之" + des[i].tag_confidence
          tmp.push(con)
        }
        that.addChat(tmp, 'l');
      },
      fail: function (res) {
        console.log(e)
        util.showModel('识别失败', '请检查网络状态或更换识别方式')
      }
    })
  },

  //图片描述
  doDescribe: function () {
    util.showModel('提示','该功能正在开发，敬请期待')
  },

  //转到我的页面
  doMine: function(){
    wx.navigateTo({
      url: '../mine/mine',
    })
  },

  onReady: function () {
  },

  // 切换语音输入和文字输入
  switchInputType: function () {
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },

  // 监控输入框输入
  Typing: function (e) {
    var inputVal = e.detail.value;
    var buttDis = true;
    if (inputVal.length != 0) {
      var buttDis = false;
    }
    that.setData({
      askWord: inputVal,
      sendButtDisable: buttDis,
    })
  },

  // 按钮按下
  touchdown: function () {
    var _this = this;
    this.setData({
      isSpeaking: true,
    })
    that.speaking.call();
    wx.startRecord({
      success: function (res) {
        //临时路径,下次进入小程序时无法正常使用
        var tempFilePath = res.tempFilePath;
        //持久保存
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function (res) {
            //持久路径
            //本地文件存储的大小限制为 100M
            var savedFilePath = res.savedFilePath;
            that.setData({
              voice: savedFilePath
            })
          }
        })
        wx.showToast({
          title: '恭喜!录音成功',
          icon: 'success',
          duration: 1000
        })
      }
    });
  },

  // 按钮松开
  touchup: function () {
    wx.stopRecord();
    this.setData({
      isSpeaking: false,
      speakerUrl: '../image/speaker0.png',
    })
    clearInterval(that.speakerInterval);
    wx.stopRecord();
    that.addChat('', 'v');
  },

  //点击播放录音
  gotoPlay: function (e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function () {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  // 发送语料到语义平台
  sendChat: function (e) {
    let word = e.detail.value.ask_word ? e.detail.value.ask_word : e.detail.value;
    that.setData({
      askWord: word,
      sendButtDisable: true,
    });
  },

  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function (word, orientation) {
    that.addChatWithFlag(word, orientation, true);
  },

  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function (word, orientation, scrolltopFlag) {
    let ch = { 'text': word, 'time': new Date().getTime(), 'orientation': orientation };
    chatListData.push(ch);
    var charlenght = chatListData.length;
    if (scrolltopFlag) {
      that.setData({
        chatList: chatListData,
        scrolltop: "roll" + charlenght,
      });
    } else {
      that.setData({
        chatList: chatListData,
      });
    }
  },

  // 麦克风帧动画 
  speaking: function () {
    //话筒帧动画 
    var i = 0;
    that.speakerInterval = setInterval(function () {
      i++;
      i = i % 7;
      that.setData({
        speakerUrl: that.data.speakerUrlPrefix + i + that.data.speakerUrlSuffix,
      });
    }, 300);
  },

  /*
   * 通过“我能帮帮忙”服务号向志愿者发送模板消息
  */
  submitInfo: function (e) {
    var that = this
    if (!that.data.askWord) {
      util.showModel('提示', '不能发送空消息，请重试')
      return
    }
    that.addChat(that.data.askWord, 'r');
    that.setData({
      askWord: ''
    })
    wx.getStorage({
      key: 'loginMsg',
      success: function (res) {
        that.setData({
          nickName: JSON.parse(res.data).nickName,
          openId: JSON.parse(res.data).openId,
          avatarUrl: JSON.parse(res.data).avatarUrl
        })
        wx.getStorage({
          key: 'imgUrl',
          success: function (res) {
            that.setData({
              imgUrl: res.data
            })
            var mytime = new Date()
            var time = mytime.toLocaleString()
            wx.request({
              url: config.service.sendhelpinformation,
              data: {
                data: {
                  imgurl: that.data.imgUrl,
                  openid: that.data.openId,
                  help: that.data.askWord,
                  formid: e.detail.formId,
                  time: time,
                  nickName: that.data.nickName,
                  avatarurl: that.data.avatarUrl,
                },
              },
              header: {
                'content-type': 'application/json'
              },
              method: "POST",
              success: function (res) {
                // console.log("res: " + JSON.stringify(res.data));
                //console.log(this.data.imgUrl);
                //console.log(this.data.inputValue);
              }
            })
          }
        })
      }
    })
  }
})