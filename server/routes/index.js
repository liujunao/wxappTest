/**
 * ajax 服务路由集合
 */
const router = require('koa-router')({
    prefix: '/weapp'   // 定义所有路由的前缀都已 /weapp 开头
})
const controllers = require('../controllers')

// 从 sdk 中取出中间件
// 这里展示如何使用 Koa 中间件完成登录态的颁发与验证
const { auth: { authorizationMiddleware, validationMiddleware } } = require('../qcloud')

// --- 登录与授权 Demo --- //
// 登录接口 /weapp/login
router.get('/login', authorizationMiddleware, controllers.login)
// 用户信息接口（可以用来验证登录态） /weapp/user
router.get('/user', validationMiddleware, controllers.user)

// --- 图片上传 Demo --- //
// 图片上传接口，小程序端可以直接将 url 填入 wx.uploadFile 中 /weapp/upload
router.post('/upload', controllers.upload)
// GET 用来响应请求向志愿者发送求助模板消息的
//router.get('/sendhelpinformation',controllers.sendhelpinformation)
router.post('/sendhelpinformation',controllers.sendhelpinformation)
router.get('/help', controllers.help)
router.post('/help', controllers.help)

router.get('/supplyhelp/supplybindmanhelp', controllers.supplyhelp.supplybindmanhelp)
router.post('/supplyhelp', controllers.supplyhelp.post)

// --- 信道服务接口 Demo --- //
// GET  用来响应请求信道地址的 /weapp/tunnel
router.get('/tunnel', controllers.tunnel.get)
// POST 用来处理信道传递过来的消息
router.post('/tunnel', controllers.tunnel.post)
// selectHelpInfo POST 用来查询求助信息
router.post('/selectHelpInfo', controllers.selectHelpInfo)

// --- 客服消息接口 Demo --- //
// GET  用来响应小程序后台配置时发送的验证请求 /weapp/message
router.get('/message', controllers.message.get)
// POST 用来处理微信转发过来的客服消息
router.post('/message', controllers.message.post)


// xtemplate模板引擎
/*
router.get('/view-test', function *(){
  yield this.html('test', {"title": "xtemplate demo"})
})
*/
router.get('/test', controllers.test)

module.exports = router
