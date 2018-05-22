/**
 * 我是你的眼小程序
 * 更新access_token脚本
 * @author fenghao
 */
const request = require('request')
const fs = require('fs')
const path = require('path')
const { query } = require('../model/async-db')
const util = require('util')//引入 util 工具包
const config = require('../getaccesstoken');//引入配置文件
var sd = require('silly-datetime');
var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
console.log(time);
console.log('\n======================================')
console.log('更新access_token...')

async function updateData( sql ) {
console.log('开始执行 SQL 文件...')
  let dataList = await query( sql )
  return dataList
}

async function getData( sql ){
  var result = await selectAllData( sql )
  console.log( result)
}

async function getAccessToken( url, id ){
  var rtn = ''
  await new Promise((resolve, reject) => {
   request(
      url,
      (error, response, body) => {
      if (!error && response.statusCode == 200) {
        console.log(response.statusCode);
console.log(body)
        resolve(body)
      }else{
        reject( "error --")
      }
    });
   }).then(result => {
      console.log(result)
      rtn = JSON.parse(result)
      return result.access_token
   }).catch(err => {
      console.log("erro: " + err)
      rtn = err
      return err
   })
   return rtn.access_token

}

async function exec(url, id, time){
  res = await getAccessToken( url, id )
  var sql = "UPDATE `accessTokenWZA` SET `access_token` = '" + res + "' , `update_time` = '" + time + "' WHERE `id` = '"+id+"'";
console.log(sql)
  rnt =  await updateData( sql )
  console.log(res)
  console.log(rnt)
  process.exit();
}

//设置 Weapp 对象属性 appID
var appID = config.appID;
//设置 Weapp 对象属性 appScrect
var appScrect = config.appScrect;
//设置 Weapp 对象属性 apiDomain
var apiDomain = config.apiDomain;
//设置 Weapp 对象属性 apiURL
var apiURL = config.apiURL;
var url = util.format(apiURL.accessTokenApi,apiDomain,appID,appScrect);
// 1: 微信服务号的access_token 2: 小程序的access_token
var id = 2
exec(url, id, time)
