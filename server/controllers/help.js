const request = require('request'),
gethelpinformastionJson = require('../gethelpinformastion'),
//weappaccessTokenJson = require('../access_token'),
fs = require('fs'), //引入 fs 模块
helpinfoJson = require('../forhelp');
const { mysql: config } = require('../config')

const { query } = require('../model/async-db')

async function selectAllData( sql ) {
  let dataList = await query( sql )
  return dataList
}

async function getData( sql ) {
  let dataList = await selectAllData( sql )
  console.log('dataList')
  console.log( dataList )
  return dataList
}

module.exports =  async function (ctx, next) {
console.log(ctx.query.helpId)
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
connection.connect();
const cnt = DB.select('img_url', 'formid', 'blindman_open_id', 'blindman_nickname', 'ask_for_help_content', 'supply_help_time', 'volunteer_nickname').where({id: global.id}).from('helpInfo').toString()
var  userGetSql = cnt;
//查 query

//let dataList = await query( userGetSql )
//console.log(datalist)
//let datalist = getData(userGetSql)
//console.log(datalist)

//connection.query(userGetSql,function (err, result) {
await connection.query(userGetSql, async function (err, result) {
        if(err){
          console.log('[SELECT ERROR] - ',err.message);
          return;
        }
       console.log(result)
       console.log('---------------SELECT----------------');
       console.log(Object.values(result[0]));
       console.log('$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$$');
       imgUrl = Object.values(result[0])[0]
  nickName = Object.values(result[0])[3]
  help = Object.values(result[0])[4]
  let time = Object.values(result[0])[5]
  let volunteerNickName = Object.values(result[0])[6]
  let formid = Object.values(result[0])[1]
  gethelpinformastionJson.form_id = formid
console.log(ctx.request.method)
  //if ( ctx.request.url === '/weapp/help' && ctx.request.method === 'GET' ) {
  if (  ctx.request.method === 'GET' ) {
    // 当GET请求时候返回表单页面
console.log('i')
postUrl = "/weapp/help?helpId=" +global.id
    global.html = `
      <form method="POST" action=\"${postUrl}\"  >
        <p>求助者: ${nickName}</p>
        <p>求助内容: ${help}</p>
        <p>求助图片</p>
        <image src= ${imgUrl} class="image" ></image>
        <p>我的回复</p>
        <input name="reply" /><br/>
        <button type="submit">发送</button>
      </form>
    `
console.log(html)
// ejs 模板渲染
/*
  await ctx.render(
	'index', {
	nickName,
	help,
 	imgUrl,
  })
*/
  



    //ctx.body = html
  //} else if ( ctx.url === '/weapp/help' && ctx.request.method === 'POST' ) {
  } else if ( ctx.request.method === 'POST' ) {
    console.log('i')
    // 当POST请求的时候，解析POST表单里的数据，并显示出来
    console.log(JSON.stringify(ctx.request.body))
    gethelpinformastionJson.data.keyword1.value = ctx.request.body.reply
    gethelpinformastionJson.data.keyword2.value = volunteerNickName
    gethelpinformastionJson.data.keyword5.value = help
    var mytime = new Date()
    var supply_help_time = mytime.toLocaleString()
gethelpinformastionJson.data.keyword4.value = supply_help_time
    // update 帮助内容和帮助时间 
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
console.log('access_token: '+ weappaccessTokenJson.access_token)
    request({
      url: 'https://api.weixin.qq.com/cgi-bin/message/wxopen/template/send?access_token='+weappaccessTokenJson.access_token,
      method: "POST",
      json: true,
      headers: {
        "content-type": "application/json",
      },
      body: gethelpinformastionJson,
    }, function (error, response, body) {
    console.log(gethelpinformastionJson)
      if (!error && response.statusCode == 200) {
        console.log(error)
        console.log(gethelpinformastionJson)
        console.log(body);
      }
    });
    //let postData = parsePostData( ctx )
    ctx.body = JSON.stringify(ctx.request.body)
  } else {
    // 其他请求显示404
    ctx.body = '<h1>404！！！ o(╯□╰)o</h1>'
  }
  
});
  //connection.end();
  await connection.end();
/*
 async sign( ctx ){
    ctx.boby = { err : 'ok'}
 },
*/
 console.log('nickname: '+ nickName)
/*
 let title = nickName
 return ctx.render(
        'index', {
        title,
        nickName,
        help,
        imgUrl,
  })
*/

  console.log('here')
  ctx.body = global.html
};
