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

const config = require('../config.js')

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
      let tmp = []
      for (let i = 0; i < des.length; i++) {
        let con = des[i].tag_name + "正确率为百分之" + des[i].tag_confidence
        tmp.push(con)
      }
      console.log('util: ' + tmp)
      wx.setStorageSync('AiRes', tmp)
    },
    fail: function (res) {
      console.log(e)
      util.showModel('识别失败', '请检查网络状态或更换识别方式')
    }
  })
}

module.exports = { formatTime, showBusy, showSuccess, showModel, showCon }
