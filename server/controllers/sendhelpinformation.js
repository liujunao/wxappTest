const        request = require('request'),
                post = require('../request/post'),
                  fs = require('fs'), //引入 fs 模块
     accessTokenJson = require('../../wxserver/access_token');
//var  tmplateMessageJson = require('../template_message');
//const helpUrl = 'https://www.bemyeyes.com.cn/weapp/help?helpId='
const helpUrl = 'http://wxserver.bemyeyes.com.cn/helpDetail.html?helpId='
const { mysql: config } = require('../config')
const volunteerOpenId = 'oUkCajhHYh4NOH25tXNq95WnhGMk'
//const volunteerOpenId = 'oUkCajhHYh4NOH25tXNq95WnhGMk'
const { query } = require('../model/async-db')


async function selectAllData( sql ) {
  let dataList = await query( sql )
  return dataList
}

/*
 * 获取微信服务号的access_token用于给志愿者发送求助的模板消息
*/
async function getAccessToken() {
  let sql = " select `access_token` from `accessTokenWZA` where `id` = '1' "
  let result = await selectAllData( sql )
  let rnt = Object.values(result[0])[0]
  console.log(rnt)
  return rnt
}

async function getVolunteerIds( num, cnt, volunteerList, length){
  while(cnt < num){
  //let m = await getOpenId(num-cnt)
  //取出随机数
  let rnd = await Math.ceil(Math.random()*(length-cnt));
  if (rnd === 0){
     continue
  }
  cnt = cnt + 1
  // 交换openid数组中被抽中的元素和第length-cnt个元素的位置
  let tmp = volunteerList[rnd-1]
  console.log('rnd: '+ rnd)
  volunteerList[rnd-1] = volunteerList[length-cnt]
  volunteerList[length-cnt] = tmp
  console.log(volunteerList)
  }
  // 取出最后num个openid，即是随机到的志愿者openid
  return volunteerList.slice(length-num ,length)
}

async function getVolunteerNickName(openId, access_token){
  let url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+openId
  request(url, function (error, response, body) {
  if (!error && response.statusCode == 200) {
    console.log(body.nickname) //
  }
})  
}

module.exports = async function (ctx, next) {
// 随机挑出3名志愿者发送求助的模板消息
const num = 5
var count = 0
var volunteerOpenIdList = [   "oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "oUkCajtctotUomFgQaq2D0wUEgCk",
                              "oUkCajpr5S3MjyXN1Ey0Pu95ID_8",
			      "oUkCajh7RzYqZfzyHYVgNXuwRFGc",
			      "oUkCajrAZqlqhW2eFb8D2KHyisQE"
			] 
// var volunteerOpenIdList = ["oUkCajhHYh4NOH25tXNq95WnhGMk",  "oUkCajh7RzYqZfzyHYVgNXuwRFGc", "oUkCajpr5S3MjyXN1Ey0Pu95ID_8"]
//var volunteerOpenIdList = ["oUkCajpr5S3MjyXN1Ey0Pu95ID_8", "oUkCajh7RzYqZfzyHYVgNXuwRFGc"]
const length = volunteerOpenIdList.length
var volunteerOpenIds = await getVolunteerIds( num, count, volunteerOpenIdList, length)
console.log("openids: \n")
console.log(volunteerOpenIds)
//process.exit()
  //let postData = parsePostData( ctx )
  //ctx.body = postData
  console.log('postdata: '+ JSON.stringify(ctx.request.body))
 // 获取发送模板消息的微信服务号access_token
  var access_token = await getAccessToken();
console.log("a_t: " + access_token)
  // 获取求助信息
  var blindman_open_id = ctx.request.body.data.openid
  var ask_for_help_time = ctx.request.body.data.time
  var blindman_nickname = ctx.request.body.data.nickName
  var ask_for_help_content = ctx.request.body.data.help
  var img_url = ctx.request.body.data.imgurl
  var formid = ctx.request.body.data.formid
  var blindman_avatar_url = ctx.request.body.data.avatarurl
console.log(blindman_avatar_url)
  // 构建入库sql
  const DB = require('knex')({
    client: 'mysql',
    connection: {
        host: config.host,
        port: config.port,
        user: config.user,
        password: config.pass,
        database: config.db,
        charset: config.char,
        multipleStatements: true
    }
  })
  const cnt = DB.insert({
    volunteer_open_id: volunteerOpenId,
    blindman_open_id: blindman_open_id,
    blindman_nickname: blindman_nickname,
    volunteer_nickname: '周宽宁',
    supply_help_content: '',
    ask_for_help_content: ask_for_help_content,
    img_url: img_url,
    formid: formid,
    blindman_avatar_url: blindman_avatar_url,
  }).into('helpInfo').returning('*').toString()
console.log(cnt)
  DB.raw(cnt).then(res => {
    console.log('入库成功')
    console.log(res)
console.log(Object.values(res[0]))
console.log(Object.values(res[0])[2])
    global.helpId = Object.values(res[0])[2]
  //  process.exit(0)
  var  tmplateMessageJson = require('../template_message');
  // 求助者昵称
  tmplateMessageJson.data.keyword1.value = blindman_nickname
  // 求助内容
  tmplateMessageJson.data.keyword3.value = ctx.request.body.data.help
  // 求助时间
  tmplateMessageJson.data.keyword4.value = ctx.request.body.data.time
  tmplateMessageJson.url = helpUrl + global.helpId
  tmplateMessageJson.touser = volunteerOpenId 
console.log('url: ' + tmplateMessageJson.url)//  -----debug------

console.log('msg: '+ JSON.stringify(tmplateMessageJson))
 
  volunteerOpenIds.forEach(async function (value, index, array ){

  tmplateMessageJson.touser = value 
  await request({
        url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+access_token,
        method: "POST",
        json: true,
        headers: {
                "content-type": "application/json",
        },
        body: tmplateMessageJson
  }, function (error, response, body) {
        if (!error && response.statusCode == 200) {
                console.log(error)
                console.log(accessTokenJson.access_token)
                console.log(body);
        }
  });
  console.log('openid: ' + value)
});

  }, err => {
    throw new Error(err)
  })
  ctx.state.data = { msg: '发送求助模板消息成功'}
};
