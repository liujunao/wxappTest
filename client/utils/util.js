let Promise = require('./promise.js');
let upng = require('./upng-js/UPNG.js');
let config = require('../config.js');

const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

// 显示繁忙提示
var showBusy = text => wx.showToast({
  title: text,
  icon: 'loading',
  duration: 10000
})

// 显示成功提示
var showSuccess = text => wx.showToast({
  title: text,
  icon: 'success'
})

// 显示失败提示
var showModel = (title, content) => {
  wx.hideToast();

  wx.showModal({
    title: title,
    content: content
  })
}

//识别图片内容信息，并以标签的形式显示
var showCon = () => {
  var that = this
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
      showSuccess('识别成功')
      // var data = JSON.parse(res.data)
      var data = res.data
      if (data.code !== 0) {
        showModel('识别失败', '请检查网络状态或更换识别方式')
        return
      }
      var info = data.data
      if (info.code !== 0) {
        showModel('识别失败', '请检查网络状态或更换识别方式')
        return
      }
      let des = info.tags
      let result = []
      let tmp = ""
      for (let i = 0; i < des.length; i++) {
        let con = des[i].tag_name + "正确率为百分之" + des[i].tag_confidence
        tmp += con + ","
      }
      result.push(tmp)
      wx.setStorageSync('AiRes', result)
    },
    fail: function (res) {
      console.log(e)
      util.showModel('识别失败', '请检查网络状态或更换识别方式')
    }
  })
}

const canvasID = 'pngCanvas';
var toPNGBase64 = (imgPath, img) => {
  return new Promise((resolve, reject) => {
    let ctx = wx.createCanvasContext(canvasID);
    // 1. 绘制图片至canvas
    ctx.drawImage(imgPath, 0, 0, img.width, img.height);
    // 绘制完成后执行回调，API 1.7.0
    ctx.draw(false, () => {
      // 2. 获取图像数据， API 1.9.0
      wx.canvasGetImageData({
        canvasId: canvasID,
        x: 0,
        y: 0,
        width: img.width,
        height: img.height,
        success(res) {
          // 3. png编码
          let pngData = upng.encode([res.data.buffer], res.width, res.height)
          // 4. base64编码
          resolve(wx.arrayBufferToBase64(pngData));
        },
        fail(e) {
          console.log(e)
          showModel('失败', 'canvas获取图片信息失败')
          reject({
            code: 2,
            reason: 'canvas获取图片信息失败'
          });
        }
      });
    });
  });
}

module.exports = { formatTime, showBusy, showSuccess, showModel, showCon, toPNGBase64 }
