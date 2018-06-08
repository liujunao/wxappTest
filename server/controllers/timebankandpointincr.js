const request = require('request')
const { mysql: config } = require('../config')
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


module.exports = {
  post: async  (ctx, next) => {
console.log( ctx.request.body)
console.log(ctx.request.body.timebankincr)
var volunteerOpenid = ctx.request.body.volunteeropenid
var timeBankIncr = ctx.request.body.timebankincr
var pointIncr = ctx.request.body.pointincr
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
console.log('更新志愿者的时间银行和积分')
var sd = require('silly-datetime');
      var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
    var incrSql = "update `volunteerInfo` set `point` = `point` + "+ pointIncr +" , `timebank` = `timebank`+ "+ timeBankIncr +" , `update_time` = '"+ time  +"' where `openid` = '"+volunteerOpenid+"'" 
    DB.raw(incrSql).then(res => {
        console.log('时间银行和积分更新成功')
        console.log(res)
    }, err => {
        throw new Error(err)
    })
    ctx.state.data = {"errcode": 0, "errmsg": "ok"}
  },
}
