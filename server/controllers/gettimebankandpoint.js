const request = require('request')
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

async function exec( sql ){
  let result = await selectAllData( sql )
console.log(result)
  let point = Object.values(result[0])[0] 
  let timeBank = Object.values(result[0])[1]
  return { "point":point, "timebank": timeBank}
}

module.exports = {
  post: async  (ctx, next) => {
console.log(ctx.request.body)
var id = ctx.request.body.helpId
var point
var timeBank
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
console.log('获取积分和时间银行奖励值')
    var selectSql = await DB.select('volunteer_get_point','volunteer_get_timebank').where({id: id}).from('helpInfo').toString()
    ctx.state.data = await exec(selectSql)
  },
}
