const debug = require('debug')('qcloud-sdk[ci]')
const crypto = require('crypto')
const config = require('../config.js')
const http = require('axios')

//- 身份证识别
function idCardIdentify(imageUrls, ciBucket, cardType) {
  debug(`Identify: ${JSON.stringify(imageUrls)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/idcard',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      bucket: ciBucket,
      card_type: cardType,
      url_list: imageUrls
    }
  })
}

//- 印刷体识别 == 通用 ocr 
function ocr(imageUrl, ciBucket) {
  debug(`Ocr: ${JSON.stringify(imageUrl)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/general',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      bucket: ciBucket,
      url: imageUrl
    }
  })
}

//营业执照识别
function ocrBizlicense(imageUrl, ciBucket) {
  debug(`Ocr: ${JSON.stringify(imageUrl)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/bizlicense',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      url: imageUrl
    }
  })
}

//- 名片识别 == 卡片识别
function orcIdIdentify(imageUrls, ciBucket) {
  debug(`Identify: ${JSON.stringify(imageUrls)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/businesscard',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      bucket: ciBucket,
      url_list: imageUrls
    }
  })
}

//- 图像标签 == 内容识别
function getContent(imageUrls, ciBucket) {
  debug(`Identify: ${JSON.stringify(imageUrls)}`)

  return http({
    url: 'http://service.image.myqcloud.com/v1/detection/imagetag_detect',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      url: imageUrls
    }
  })
}

//- 银行卡识别
function cardIdentify(imgUrl, ciBucket) {
  debug(`Identify: ${JSON.stringify(imageUrl)}`)

  return http({
    url: 'http://recognition.image.myqcloud.com/ocr/bankcard',
    headers: {
      'Content-Type': 'application/json',
      Authorization: getSignature(ciBucket)
    },
    method: 'POST',
    data: {
      appid: config.qcloudAppId.toString(),
      url: imageUrl
    }
  })
}

//- 语音合成 == 语音识图
function txtToRecord(text, ciBucket) {
  return http({
    url: 'http://api.youtu.qq.com/youtu/ttsapi/text_to_audio',
    headers: {
      'Content-Type': 'application/json',
      Authorization: aiGetSignature()
    },
    method: 'POST',
    data: {
      appid: config.aiAppId.toString(),
      text: text.toString('utf8'),
      model_type: 0,
      speed: 1
    }
  })
}

/**
 * 获取签名
 */
function getSignature(fileBucket) {
  const appId = config.qcloudAppId
  const secretId = config.qcloudSecretId
  const secretKey = config.qcloudSecretKey

  /**
   * a=[appid]&b=[bucket]&k=[SecretID]&e=[expiredTime]&t=[currentTime]&r=[rand]&u=[userid]&f=[fileid]
   */
  const paramArr = [
    'a=' + appId,
    'b=' + fileBucket,
    'k=' + secretId,
    'e=' + (Math.floor(Date.now() / 1000) + 10),
    't=' + Math.floor(Date.now() / 1000),
    'r=' + Math.floor(Math.random() * 10),
    'u=' + 0
  ]

  debug(`paramArr: ${JSON.stringify(paramArr)}`)

  const signatureStr = paramArr.join('&')
  const temSignBuf = crypto.createHmac('sha1', secretKey).update(signatureStr).digest()
  const signatureBuf = Buffer.from(signatureStr)
  const signature = Buffer.concat([temSignBuf, signatureBuf]).toString('base64')

  debug(`signature: ${signature}`)

  return signature
}

/**
 * 获取腾讯优图AI签名
 */
function aiGetSignature() {

  var EXPIRED_SECONDS = 2592000;
  var expired = parseInt(Date.now() / 1000) + EXPIRED_SECONDS;

  var secretId = config.aiSecretId || '';
  var secretKey = config.aiSecretKey || '';
  var appid = config.aiAppId || '';

  var now = parseInt(Date.now() / 1000);
  var rdm = parseInt(Math.random() * Math.pow(2, 32));

  // the order of every key is not matter verify
  var plainText = 'a=' + appid + '&k=' + secretId + '&e=' + expired + '&t=' + now + '&r=' + rdm + '&u=1713507920&f=';
  var data = new Buffer(plainText, 'utf8');
  var res = crypto.createHmac('sha1', secretKey).update(data).digest();
  var bin = Buffer.concat([res, data]);
  var sign = bin.toString('base64');

  return sign;
}


module.exports = {
  idCardIdentify,
  ocr,
  ocrBizlicense,
  orcIdIdentify,
  getContent
}