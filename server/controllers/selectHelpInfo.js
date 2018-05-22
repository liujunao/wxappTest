const request = require('request'),
gethelpinformastionJson = require('../gethelpinformastion'),
weappaccessTokenJson = require('./weappaccess_token'),
fs = require('fs'), //引入 fs 模块
helpinfoJson = require('../forhelp');
const { mysql: config } = require('../config')

module.exports = function (ctx, next) {
  // 构建select sql语句
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
DB.select('*')
.from('helpInfo')
.on('query', function(data) {
  console.log(data);
})
.then(function() {
  // ...
});  

  console.log(
  DB.select('img_url', 'formid', 'blindman_open_id', 'blindman_nickname', 'supply_help_content', 'ask_help_time', 'formid')
  .where({id : 3})
  .from('helpInfo').toSQL() 
  )
console.log('done')
  DB.select('img_url', 'formid', 'blindman_open_id', 'blindman_nickname', 'supply_help_content', 'ask_help_time', 'formid')
  .where({id : 3})
  .from('helpInfo')
  .on('query-response', function(response, obj, builder) {
  // ...
  //console.log(JSON.parse(Object.values(response[0])))
  console.log(Object.values(response[0]))
  console.log(Object.values(response[0])[2])
  global.imgUrl = Object.values(response[0])[0]
  let nickName = Object.values(response[0])[3]
  let help = Object.values(response[0])[4]
  let time = Object.values(response[0])[5]
  let formid = Object.values(response[0])[6]
  gethelpinformastionJson.form_id = formid
console.log(formid)
})
.then(function(response) {
  // Same response as the emitted event
})
.catch(function(error) { });
  console.log('postdata: '+ JSON.stringify(ctx.request.body))
  console.log(global.imgUrl)
  ctx.state.data = { msg: global.imgUrl }
};
