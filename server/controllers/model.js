const getModel = require('../lib/getModel.js')

module.exports = async ctx => {

  if (ctx.query.action) {
    const { data: tokenResult } = await getModel.getToken()
    ctx.state.data = tokenResult
    console.log(tokenResult)
  }
}