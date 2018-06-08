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
console.log(ctx.request.body)
var id = ctx.request.body.helpId
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
console.log('取消帮助信息的等待状态')
var sd = require('silly-datetime');
      var time=sd.format(new Date(), 'YYYY-MM-DD HH:mm:ss');
      var updatesql = DB.update({
       update_time: time,
       status: 0,
    }).where({id: id}).from('helpInfo').toString()
    DB.raw(updatesql).then(res => {
        console.log('status更新成功')
        console.log(res)
    }, err => {
        throw new Error(err)
    })
    ctx.state.data = {"errcode": 0, "errmsg": "ok"}
  },
}
