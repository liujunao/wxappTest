const request = require('request'),
gethelpinformastionJson = require('../gethelpinformastion'),
fs = require('fs'), //引入 fs 模块
helpinfoJson = require('../forhelp');
const { mysql: config } = require('../config')

const { query } = require('../model/async-db')
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

async function selectAllData( sql ) {
  let dataList = await query( sql )
  return dataList
}

async function getAccessToken() {
  let sql = " select `access_token` from `accessTokenWZA` where `id` = '2' "
  let result = await selectAllData( sql )
  let rnt = Object.values(result[0])[0]
  console.log(rnt)
  return rnt
}

async function getData( requestmethod, sql ) {
  if(requestmethod != "GET")
  {
      return ''
  }
  let result = await selectAllData( sql )
  imgUrl = Object.values(result[0])[0]
      nickName = Object.values(result[0])[3]
      askforhelpcontent = Object.values(result[0])[4]
      var time = Object.values(result[0])[5]
      var volunteerNickName = Object.values(result[0])[6]
      var formid = Object.values(result[0])[1]
      var blindmanavatarurl = Object.values(result[0])[7]
      var blindman_open_id = Object.values(result[0])[2]
      console.log(formid)
      console.log(blindman_open_id)
   var helpInfoJson = {
        "blindman_open_id": blindman_open_id,
        "blindmannickname": nickName,
        "volunteernickname": volunteerNickName,
        "askforhelpcontent": askforhelpcontent,
        "imgurl": imgUrl,
        "blindmanavatarurl": blindmanavatarurl,
        "formid": formid
      } 
  return helpInfoJson
}

async function postparse( requestmethod,ctx,  DB, access_token ){
if(requestmethod != "POST")
  {
      return 'error get'
  }
  console.log(JSON.stringify(ctx.request.body))
    gethelpinformastionJson.data.keyword1.value = ctx.request.body.supplyhelpcontent
    gethelpinformastionJson.data.keyword2.value = ctx.request.body.volunteernickname
    gethelpinformastionJson.data.keyword5.value = ctx.request.body.askforhelpcontent
    gethelpinformastionJson.form_id = ctx.request.body.formid
     gethelpinformastionJson.touser = ctx.request.body.blindman_open_id
    var mytime = new Date()
    var supply_help_time = mytime.toLocaleString()
    gethelpinformastionJson.data.keyword4.value = supply_help_time
    var weappaccessTokenJson = require('../access_token')
    // update 帮助内容和帮助时间
/*
    const updatesql = DB.update({
      supply_help_content: ctx.request.body.reply,
      supply_help_time: supply_help_time
    }).where({id: global.id}).from('helpInfo').toString()
    console.log(updatesql)
    var userModSql = "update `helpInfo` set `supply_help_content` = ?, `supply_help_time` = ? where `id` = ?";
    var userModSql_Params = [ctx.request.body.reply,supply_help_time,global.id];
    //改 up
    connection.query(userModSql,userModSql_Params,function (err, result) {
      if(err){
         console.log('[UPDATE ERROR] - ',err.message);
         return;
      }
     console.log('----------UPDATE-------------');
     console.log('UPDATE affectedRows',result.affectedRows);
     console.log('******************************');
    });
*/
console.log('access_token: '+ access_token)
  var rtn = ''
  await new Promise((resolve, reject) => {
   request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+access_token,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: gethelpinformastionJson,
    }, (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(response.statusCode);
        resolve(body)
      }else{
        reject( "error --")
      }
    });
   }).then(result => {
      rtn = result
      return result
   }).catch(err => {
      console.log("erro: " + err)
      rtn = err
      return err
   })
   return rtn
 
}

async function requestpost(gethelpinformastionJson, weappaccessTokenJson, access_token){
console.log('here')
console.log(gethelpinformastionJson)
console.log(weappaccessTokenJson)
// sync
new Promise((resolve, reject) => {
   request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+access_token,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: gethelpinformastionJson,
    }, function (error, response, body) {
      if (!error && response.statusCode == 200) {
        console.log(response.statusCode);
        resolve(body)
      }else{
        reject( "error --")
      }
    });
   }).then(result => {
       console.log(result)
      return result
   }).catch(err => {
      console.log("erro: " + err)   
      return err
   })
}

module.exports = {
  supplybindmanhelp: async  (ctx, next) => {
console.log(ctx.query.helpId)
var access_token = await getAccessToken()
global.id = ctx.query.helpId
var weappaccessTokenJson = require('../access_token')
// 构建select sql语句
  var  nickName = ''
  var  help = ''
  var imgUrl = ''
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
console.log('hi')
var mysql  = require('mysql');
var connection = mysql.createConnection({
  host     : config.host,
  user     : config.user,
  password : config.pass,
  port: config.port,
  database: config.db,
});
const cnt = DB.select('img_url', 'formid', 'blindman_open_id', 'blindman_nickname', 'ask_for_help_content', 'supply_help_time', 'volunteer_nickname', 'blindman_avatar_url', 'volunteer_open_id').where({id: global.id}).from('helpInfo').toString()
var  userGetSql = cnt;
if (  ctx.request.method === 'GET' ) {
    // 当GET请求时候返回表单页面
    
  }else if ( ctx.request.method === 'POST' ) {

 }else {
    // 其他请求显示404
    ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
  }
  requestmethod  = ctx.request.method
  ctx.state.data = await getData(requestmethod ,userGetSql) 
  console.log(ctx.state)
  if (ctx.state.data === '' && ctx.request.method == "POST"){
     console.log("post!")
ctx.state.data = await postparse(requestmethod, ctx, DB )
  }
  console.log('here')
  },
 post: async  (ctx, next) => {
var access_token = await getAccessToken()
console.log(JSON.stringify(ctx.request.body))
    console.log('hi post!')
    requestmethod = ctx.request.method
    ctx.state.data = await postparse(requestmethod, ctx, DB , access_token)
console.log(ctx.state.data)
 }
 

}
