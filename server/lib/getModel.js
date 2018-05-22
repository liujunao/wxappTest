const config = require('../config.js')
const http = require('axios')
const https = require('https')

function getToken() {
  return http({
    url: 'https://api.weixin.qq.com/cgi-bin/token',
    method: 'GET',
    data: {
      'grant_type': 'client_credential',
      'appid': 'wx256af4f2c0d2ea39',
      'secret': '2523bb6dc78b06158259c4203a4b5260'
    }
  })
}

function getToken2(){
  https.get('https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid=wx256af4f2c0d2ea39&secret=2523bb6dc78b06158259c4203a4b5260', (res) => {
    let data = ''
    res.on('data', (d) => {
      data += d
    });
    res.on('end', () => {
      return data
    })

  }).on('error', (e) => {
    console.error(e);
  });
}