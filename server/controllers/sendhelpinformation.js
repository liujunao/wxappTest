const        request = require('request'),
                post = require('../request/post'),
                  fs = require('fs'); //引入 fs 模块
const helpUrl = 'https://www.bemyeyes.com.cn/helpDetail.html?helpId='
const { mysql: config } = require('../config')
const volunteerOpenId = 'oUkCajhHYh4NOH25tXNq95WnhGMk'
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
  return rnt
}

async function getVolunteerAvatarUrl( openid, access_token ){
  let url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+openid
  var rtn = ''
  await new Promise((resolve, reject) => {
    request(
       url,
       (error, response, body) => {
       if (!error && response.statusCode == 200) {
         resolve(body)
       }else{
         reject( "error --")
       }
     });
    }).then(result => {
       rtn = JSON.parse(result)
    }).catch(err => {
       console.log("getVolunteerAvatarUrl erro: " + err)
       rtn = err
    }) 
  return rtn.headimgurl
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
  var rtn = ''
  await new Promise((resolve, reject) => {
    request(
       url,
       (error, response, body) => {
       if (!error && response.statusCode == 200) {
         resolve(body)
       }else{
         reject( "error --")
       }
     });
    }).then(result => {
       rtn = JSON.parse(result)
    }).catch(err => {
       console.log("getVolunteerNickName erro: " + err)
       rtn = err
    })
  return rtn
}

// 通过openid获取“我能帮帮忙”服务号里志愿者的微信用户信息
function getVolunteerWeChatInfoBy(openId, access_token, url, callback){
  //let url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+openId
  //var rtn = ''
  new Promise((resolve, reject) => {
    request(
       url,
       (error, response, body) => {
       if (!error && response.statusCode == 200) {
         resolve(body)
       }else{
         reject( "error --")
       }
     });
    }).then(result => {
       //rtn = JSON.parse(result)
       callback(JSON.parse(result))
    }).catch(err => {
       console.log("getVolunteerNickName erro: " + err)
       callback(err)
       //rtn = err
    })
}


// 向志愿者发送模板消息
function  sendMsg(access_token, templatemsg){
  var rtn = ''
   new Promise(async (resolve, reject) => {
       request({
          url: 'https://api.weixin.qq.com/cgi-bin/message/template/send?access_token='+access_token,
          method: "POST",
          json: true,
          headers: {
                  "content-type": "application/json",
          },
          body: templatemsg
        }, function (error, response, body) {
          if (!error && response.statusCode == 200) {
                console.log(error)
                console.log(body);
                rtn = body
          }
        });
       }).then( async function(res) {
          console.log("res: " + res)
    }).catch(err => {
       console.log("sendMsg erro: " + err)
       rtn = err
    }) 
}

module.exports = async function (ctx, next) {
  // 随机挑出num名志愿者发送求助的模板消息
  const num = 1 
  var count = 0
/*
 * 注：体验志愿者
 * openid			   名字
 * oUkCajhHYh4NOH25tXNq95WnhGMk	   冯皓
 * oUkCajtctotUomFgQaq2D0wUEgCk    郭慧敏
 * oUkCajpr5S3MjyXN1Ey0Pu95ID_8    周江南
 * oUkCajh7RzYqZfzyHYVgNXuwRFGc    严宽宁
 * oUkCajrAZqlqhW2eFb8D2KHyisQE    少帅
 * 
 */
/*
var volunteerOpenIdList = [   "oUkCajhHYh4NOH25tXNq95WnhGMk",
                              "oUkCajtctotUomFgQaq2D0wUEgCk",
                              "oUkCajpr5S3MjyXN1Ey0Pu95ID_8",
			      "oUkCajh7RzYqZfzyHYVgNXuwRFGc",
			      "oUkCajrAZqlqhW2eFb8D2KHyisQE"
			] 
*/
  // var volunteerOpenIdList = ["oUkCajhHYh4NOH25tXNq95WnhGMk",  "oUkCajh7RzYqZfzyHYVgNXuwRFGc", "oUkCajpr5S3MjyXN1Ey0Pu95ID_8"]
  //var volunteerOpenIdList = ["oUkCajpr5S3MjyXN1Ey0Pu95ID_8", "oUkCajh7RzYqZfzyHYVgNXuwRFGc"]
  var volunteerOpenIdList = [ "oUkCajpr5S3MjyXN1Ey0Pu95ID_8"]
  const length = volunteerOpenIdList.length
  // 随机取出num名志愿者发送模板消息
  var volunteerOpenIds = await getVolunteerIds( num, count, volunteerOpenIdList, length)
  console.log("OpenidList: \n") // ----------debug--------
  console.log(volunteerOpenIds) // ----------debug--------
  // process.exit()
  console.log('postdata: '+ JSON.stringify(ctx.request.body))
  // 获取用于发送模板消息的微信服务号access_token
  var access_token = await getAccessToken();
  console.log("wxserver_access_token: " + access_token)
  // 获取求助信息
  /* 盲人小程序openid: blindman_open_id
   * 求助时间：ask_for_help_time 
   * 盲人昵称：blindman_nickname
   * 求助内容：ask_for_help_content
   * 求助图片链接：img_url
   * 小程序表单id: formid (用于给盲人发送小程序端的模板消息，只能用一次) 
   * 盲人微信头像链接：blindman_avatar_url
  */
  var blindman_open_id = ctx.request.body.data.openid
  var ask_for_help_time = ctx.request.body.data.time
  var blindman_nickname = ctx.request.body.data.nickName
  var ask_for_help_content = ctx.request.body.data.help
  var img_url = ctx.request.body.data.imgurl
  var formid = ctx.request.body.data.formid
  var blindman_avatar_url = ctx.request.body.data.avatarurl
  // 引入sql构建器：knex模块
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
  // 构建入库sql语句
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
  console.log("insert helpInfo sql: " + cnt)// ------debug-------
  DB.raw(cnt).then(res => {
    console.log('入库成功')
    console.log(res)
    global.helpId = Object.values(res[0])[2]
  //  process.exit(0)
    var  tmplateMessageJson = require('../template_message');
    // 获取求助者昵称
    tmplateMessageJson.data.keyword1.value = blindman_nickname
    // 获取求助内容
    tmplateMessageJson.data.keyword3.value = ctx.request.body.data.help
    // 获取求助时间
    tmplateMessageJson.data.keyword4.value = ctx.request.body.data.time
    tmplateMessageJson.url = helpUrl + global.helpId
    //tmplateMessageJson.touser = volunteerOpenId 
    console.log('url: ' + tmplateMessageJson.url)//  -----debug------
    console.log('msg: '+ JSON.stringify(tmplateMessageJson))//  -----debug------

    //遍历随机取出的志愿者openid，向他们发送盲人求助的服务号模板消息
    for(var i=0; i<length; i++){
         (function(i) {
           url = "https://api.weixin.qq.com/cgi-bin/user/info?access_token="+access_token+"&openid="+volunteerOpenIds[i]
           tmplateMessageJson.touser = volunteerOpenIds[i]
           getVolunteerWeChatInfoBy(tmplateMessageJson.touser, access_token, url, async function(result){
             var info = result
             //获取志愿者昵称
             let volunteerNickName = info.nickname
             //获取志愿者头像
             let volunteerAvatarUrl = info.headimgurl
             tmplateMessageJson.url = helpUrl + global.helpId + '&volunteerAvatarUrl='+volunteerAvatarUrl+'&volunteernickname='+volunteerNickName
             //console.log('volunteeropenid: '+ value) // --------debug-------
             //resolve(tmplateMessageJson)
             console.log('点击服务号模板消息跳转的url: '+  tmplateMessageJson.url)
             await sendMsg(access_token, tmplateMessageJson)
      }); 
           tmplateMessageJson.touser = volunteerOpenIds[i]
           //sendMsg(access_token, tmplateMessageJson)
         })(i);

   }
  }, err => {
    throw new Error(err)
  })
  ctx.state.data = { msg: '发送求助模板消息成功'}
};
