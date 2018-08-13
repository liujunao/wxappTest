const request = require('request'),
gethelpinformastionJson = require('/home/wza/server/gethelpinformastion'),
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
  if(requestmethod != "POST")
  {
      return ''
  }
  let result = await selectAllData( sql )
  ///console.log('dataList')
  console.log( Object.values(result[0]) )
  imgUrl = Object.values(result[0])[0]
      nickName = Object.values(result[0])[3]
      askforhelpcontent = Object.values(result[0])[4]
      var time = Object.values(result[0])[5]
      var volunteerNickName = Object.values(result[0])[6]
      var formid = Object.values(result[0])[1]
      var blindmanavatarurl = Object.values(result[0])[7]
      var blindman_open_id = Object.values(result[0])[2]
      var volunteers = Object.values(result[0])[9]
      var status = Object.values(result[0])[10]
      var volunteer_open_id = Object.values(result[0])[8]
      var ask_for_help_time = Object.values(result[0])[11]
      //console.log(value);
      console.log(formid)
      console.log(blindman_open_id)
   var helpInfoJson = {
        "blindman_open_id": blindman_open_id,
        "blindmannickname": nickName,
        "volunteernickname": volunteerNickName,
        "askforhelpcontent": askforhelpcontent,
        "imgurl": imgUrl,
        "blindmanavatarurl": blindmanavatarurl,
        "formid": formid,
        "volunteers": volunteers,
        "status": status,
        "volunteer_open_id": volunteer_open_id,
        "ask_for_help_time": ask_for_help_time,
      } 
  return helpInfoJson
}

async function timeBankAndPointIncr(sql){
    var res = await query(sql)
    console.log(res)
    return res
}

module.exports = {
  gethelpinformation: async  (ctx, next) => {
console.log(ctx.request.body)
var access_token = await getAccessToken()
id = ctx.request.body.helpId
volunteeropenid = ctx.request.body.volunteeropenid
var weappaccessTokenJson = require('../access_token')
// 构建select sql语句
  var  nickName = ''
  var  help = ''
  var imgUrl = ''
  var timeBankIncr = 0
  var pointIncr = 0
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
const cnt = DB.select('img_url', 'formid', 'blindman_open_id', 'blindman_nickname', 'ask_for_help_content', 'supply_help_time', 'volunteer_nickname', 'blindman_avatar_url', 'volunteer_open_id', 'volunteers', 'status', 'ask_for_help_time').where({id: id}).from('helpInfo').toString()
var  userGetSql = cnt;
//查 query
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
  if( ctx.state.data.status === 0){
      var sd = require('silly-datetime');
      var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      var askForHelpTime = new Date(ctx.state.data.ask_for_help_time);
      var nowTime = new Date(time)
      var status
      if( (nowTime.getTime() - askForHelpTime.getTime())/1000 > 601200 ){
      // 用于给盲人端小程序发送模板消息的formid有效期为7天，这里有效期设置为601200，6天零23个小时。超过有效期，志愿者将无法帮助盲人
          status = 1
          ctx.state.data.status = 1
          var updatesql = DB.update({
            update_time: time,
            status: status,
          }).where({id: id}).from('helpInfo').toString()
            DB.raw(updatesql).then(res => {
            console.log('status更新成功')
            console.log(res)
          }, err => {
            throw new Error(err)
          }) 
      }
  }else if(ctx.state.data.status === 2){
    if(volunteeropenid ===  ctx.state.data.volunteer_open_id){
      ctx.state.data.status = 3
    }else{
      if( JSON.parse(ctx.state.data.volunteers)[volunteeropenid] === 0){
        console.log(JSON.parse(ctx.state.data.volunteers))
        timeBankIncr = timeBankIncr + 2
        pointIncr = pointIncr + 1
        var sd = require('silly-datetime');
        var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
        let volunteers = JSON.parse(ctx.state.data.volunteers)
        volunteers[volunteeropenid] = 1
        var updatesql = DB.update({
          update_time: time,
          volunteers: JSON.stringify(volunteers),
        }).where({id: id}).from('helpInfo').toString()
        DB.raw(updatesql).then(res => {
          console.log('更新volunteers成功')
          console.log(res)
        }, err => {
          throw new Error(err)
        }) 
      }
    }   	
  }else if(ctx.state.data.status === 1){
     // 求助信息已经过期
  }
  if( timeBankIncr != 0 && pointIncr != 0){
    var sd = require('silly-datetime');
    var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    var incrSql = "update `volunteerInfo` set `point` = `point` + "+ pointIncr +" , `timebank` = `timebank`+ "+ timeBankIncr +" , `update_time` = '"+ time  +"' where `openid` = '"+volunteeropenid+"'"
    console.log(incrSql)
    await timeBankAndPointIncr(incrSql)
  }
  console.log('here')
  },
}
