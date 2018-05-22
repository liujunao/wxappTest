const Koa = require('koa')
const app = new Koa()
const debug = require('debug')('koa-weapp-demo')
const response = require('./middlewares/response')
const bodyParser = require('./middlewares/bodyparser')
const config = require('./config')
const views = require('koa-views')
const path = require( 'path' );
const cors = require('koa2-cors')
const serve = require('koa-static');


// 使用响应处理中间件
app.use(response)

// 解析请求体
app.use(bodyParser())

// 静态设计
app.use(serve(__dirname + "/static/html",{ extensions: ['html']}));


// 跨域请求
app.use(cors())
// 引入路由分发
//const router = require('./routes')

// 配置服务端模板渲染引擎中间件
app.use(views(path.join(__dirname, './view'), {
  extension: 'ejs'
}))

const router = new require('./routes')
app.use(router.routes())

//xtemplate模板引擎对koa的适配
/*
var xtpl = require('xtpl/lib/koa');
xtpl(app,{
    //配置模板目录，指向工程的view目录
    views: path.resolve( __dirname, 'view' )
});
*/
/*
app.use( async function(ctx){
  await ctx.render( 'index', {
    name: 'Bernie'
  } )
} );
*/


// 启动程序，监听端口
app.listen(config.port, () => debug(`listening on port ${config.port}`))
