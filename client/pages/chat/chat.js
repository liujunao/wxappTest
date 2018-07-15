//index.js
var qcloud = require('../../vendor/wafer2-client-sdk/index');
var config = require('../../config');
var util = require('../../utils/util.js');
var ocr = require('../../utils/orcapi/ocr.js');
var plugin = requirePlugin('WechatSI');
var imgtotext_request = require('../../utils/orcapi/imgtotext_request.js');
var image_tag = require('../../utils/orcapi/image_tag.js')

var app = getApp();
var that;
//要发送的对话列表
var chatListData = [];
var speakerInterval;
var indexSet;

Page({
  data: {
    //手机高宽比
    hiTowi: '',
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

    // canvas高宽
    canvasWidth: 100,
    canvasHeight: 100,

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

  onLoad: function(options) {
    wx.setNavigationBarTitle({
      title: '求助',
    })
    let that = this;
    let sysInfo = wx.getStorageSync('sysInfo')
    that.setData({
      hiTowi: sysInfo.windowHeight / sysInfo.windowWidth
    })
    indexSet = options.indexSet;
    app.getUserInfo(function(userInfo) {
      var aUrl = userInfo.avatarUrl;
      if (aUrl != null) {
        that.setData({
          userLogoUrl: aUrl,
          imgUrl: options.imgUrl,
        });
      }
    });
    that.addChat(options.imgUrl, 'p');

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
  openCamera: function() {
    wx.reLaunch({
      url: '../index/index',
    })
  },

  // 选择图片
  checkPic: function() {
    wx.reLaunch({
      url: '../index/index?tmp=picTmp',
    })
  },

  //文字转语音
  textToSpeech: function(words) {
    var _this = this;
    plugin.textToSpeech({
      lang: 'zh_CN',
      content: words,
      success: function(res) {
        _this.setData({
          recordUrl: res.filename
        });
      },
      fail: function(res) {
        util.showModel('语音转换失败', res.msg);
      }
    });
  },

  //文字识别
  doWordIndentify: function() {
    let that = this
    that.addChat('文字识别', 'a');
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
      success: function(res) {
        util.showSuccess('识别成功')
        var data = res.data
        if (data.code !== 0) {
          let tmp = "该图片中没有文字，请更换识别方式"
          let result = []
          result.push(tmp)
          let words = result.join(' ');
          that.addChat(result, 'l');
          // tts语音转换
          that.textToSpeech(words);
          return
        }
        var info = data.data
        if (info.code !== 0) {
          let tmp = "该图片中没有文字，请更换识别方式"
          let result = []
          result.push(tmp)
          let words = result.join(' ');
          that.addChat(result, 'l');
          // tts语音转换
          that.textToSpeech(words);
          return
        }

        that.setData({
          ocrResult: info.data.items
        })
        let des = that.data.ocrResult
        let result = []
        let tmp = ""
        for (let i = 0; i < des.length; i++) {
          let con = des[i].itemstring
          tmp += con + ","
        }
        result.push(tmp)
        let words = result.join(' ');
        that.addChat(result, 'l');
        // tts语音转换
        that.textToSpeech(words);
      },
      fail: function(res) {
        console.log(e)
        let tmp = "网络异常，请重试"
        let result = []
        result.push(tmp)
        let words = result.join(' ');
        that.addChat(result, 'l');
        // tts语音转换
        that.textToSpeech(words);
      }
    })
  },

  //识别图片内容信息，并以标签的形式显示
  doConIndentity: function() {
    var that = this
    that.addChat('图片识别', 'a');
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
      success: function(res) {
        util.showSuccess('识别成功')
        // var data = JSON.parse(res.data)
        var data = res.data
        if (data.code !== 0) {
          let tmp = "请求助志愿者，这次识别结果不理想！"
          let result = []
          result.push(tmp)
          let words = result.join(' ');
          that.addChat(result, 'l');
          // tts语音转换
          that.textToSpeech(words);
          return
        }
        var info = data.data
        if (info.code !== 0) {
          let tmp = "请求助志愿者，这次识别结果不理想！"
          let result = []
          result.push(tmp)
          let words = result.join(' ');
          that.addChat(result, 'l');
          // tts语音转换
          that.textToSpeech(words);
          return
        }

        that.setData({
          conResult: info.tags
        })
        let des = that.data.conResult
        let result = []
        let tmp = ""
        for (let i = 0; i < des.length; i++) {
          let con = des[i].tag_name + "正确率为百分之" + des[i].tag_confidence
          tmp += con + ","
        }
        result.push(tmp)
        let words = result.join(' ')
        that.addChat(result, 'l')
        // tts语音转换
        that.textToSpeech(words)
      },
      fail: function(res) {
        console.log(e)
        let tmp = "网络异常，请重试"
        let result = []
        result.push(tmp)
        let words = result.join(' ');
        that.addChat(result, 'l');
        // tts语音转换
        that.textToSpeech(words);
      }
    })
  },

  //图片描述
  doDescribe: function() {
    let _this = this;
    this.addChat('图片描述', 'a');

    let img = this.data.imgUrl;
    console.log("图片描述: " + img)
    wx.getImageInfo({
      src: img,
      success(d) {
        _this.setData({
          canvasWidth: d.width,
          canvasHeight: d.height,
        });
        util.toPNGBase64(img, d)
          .then((base64) => {
            return imgtotext_request.request(base64);
          })
          .then((res) => {
            var data = res.data;
            if (data.ret !== 0) {
              let tmp = "请求助志愿者，这次识别结果不理想！"
              let result = []
              result.push(tmp)
              let words = result.join(' ');
              _this.addChat(result, 'l');
              // tts语音转换
              _this.textToSpeech(words);
              console.log(res);
              return;
            }
            var info = data.data;
            console.log(info);
            let result = []
            result.push(info.text)
            console.log("看图说话")
            _this.addChat(result, 'l');
            _this.textToSpeech(info.text);
          })
          .catch((err) => {
            console.log(err);
          });
      },
      fail(e) {
        console.log(e)
        reject({
          code: 2,
          reason: '获取图片信息失败'
        });
      }
    });
  },

  //转到我的页面
  doMine: function() {
    wx.navigateTo({
      url: '../my/my',
    })
  },

  onReady: function() {},

  // 切换语音输入和文字输入
  switchInputType: function() {
    this.setData({
      keyboard: !(this.data.keyboard),
    })
  },

  // 监控输入框输入
  Typing: function(e) {
    var inputVal = e.detail.value;
    var buttDis = true;
    if (inputVal.length != 0) {
      var buttDis = false;
    }
    that.setData({
      askWord: inputVal,
      sendButtDisable: btnDisabled,
    })
  },

  // 按钮按下
  touchdown: function() {
    var _this = this;
    this.setData({
      isSpeaking: true,
    })
    that.speaking.call();
    wx.startRecord({
      success: function(res) {
        //临时路径,下次进入小程序时无法正常使用
        var tempFilePath = res.tempFilePath;
        //持久保存
        wx.saveFile({
          tempFilePath: tempFilePath,
          success: function(res) {
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
  touchup: function() {
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
  gotoPlay: function(e) {
    var filePath = e.currentTarget.dataset.key;
    //点击开始播放
    wx.showToast({
      title: '开始播放',
      icon: 'success',
      duration: 1000
    })
    wx.playVoice({
      filePath: filePath,
      success: function() {
        wx.showToast({
          title: '播放结束',
          icon: 'success',
          duration: 1000
        })
      }
    })
  },

  // 发送语料到语义平台
  sendChat: function(e) {
    let word = e.detail.value.ask_word ? e.detail.value.ask_word : e.detail.value;
    this.setData({
      askWord: word,
      sendButtDisable: true,
    });
  },

  // 增加对话到显示界面（scrolltopFlag为True）
  addChat: function(word, orientation) {
    this.addChatWithFlag(word, orientation, true);
  },

  // 增加对话到显示界面（scrolltopFlag为是否滚动标志）
  addChatWithFlag: function(word, orientation, scrolltopFlag) {
    let ch = {
      'text': word,
      'time': new Date().getTime(),
      'orientation': orientation
    };
    chatListData.push(ch);
    var charlenght = chatListData.length;
    let data = {
      chatList: chatListData
    };
    if (scrolltopFlag) data.scrolltop = 'roll' + charlenght;
    this.setData(data);
  },

  // 麦克风帧动画 
  speaking: function() {
    //话筒帧动画 
    var i = 0;
    that.speakerInterval = setInterval(function() {
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
  submitInfo: function(e) {
    var that = this
    if (!that.data.askWord) {
      util.showModel('提示', '不能发送空消息，请重试')
      return
    }
    var help = that.data.askWord
    that.addChat(that.data.askWord, 'r');
    that.setData({
      askWord: ''
    })
    wx.getStorage({
      key: 'loginMsg',
      success: function(res) {
        that.setData({
          nickName: JSON.parse(res.data).nickName,
          openId: JSON.parse(res.data).openId,
          avatarUrl: JSON.parse(res.data).avatarUrl
        })
        wx.getStorage({
          key: 'imgUrl',
          success: function(res) {
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
                  help: help,
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
              success: function(res) {
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