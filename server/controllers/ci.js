const getCi = require('../lib/getCI.js')

module.exports = async ctx => {

  if (ctx.request.body.action && ctx.request.body.action === 'idcard') {//身份证识别
    const { data: identifyResult } = await getCi.idCardIdentify([ctx.request.body.imgUrl.replace(/.\/wxapp\//, "wxapp\/")], 'ci', 0)
    ctx.state.data = identifyResult.result_list
  } else if (ctx.request.body.action && ctx.request.body.action === 'general') {//通用印刷体识别 == ocr
    const { data: ocrResult } = await getCi.ocr(ctx.request.body.imgUrl.replace(/.\/wxapp\//, "wxapp\/"), 'ci')
    ctx.state.data = ocrResult
  } else if (ctx.request.body.action && ctx.request.body.action === 'busCard') {//营业执照识别
    const { data: pornResult } = await getCi.ocrBizlicense(ctx.request.body.imgUrl.replace(/.\/wxapp\//, "wxapp\/"), 'ci')
    ctx.state.data = pornResult
  } else if (ctx.request.body.action && ctx.request.body.action === 'idName') {//名片识别 == 卡片识别
    const { data: idResult } = await getCi.orcIdIdentify(ctx.request.body.imgUrl.replace(/.\/wxapp\//, "wxapp\/"), 'ci')
    ctx.state.data = idResult.result_list
  } else if (ctx.request.body.action && ctx.request.body.action === 'idContent') {//图像标签 == 内容识别
    const { data: conResult } = await getCi.getContent(ctx.request.body.imgUrl.replace(/.\/wxapp\//,"wxapp\/"), 'ci')
    ctx.state.data = conResult
  } else if (ctx.request.body.action && ctx.request.body.action === 'card') {//银行卡识别
    const { data: cardResult } = await getCi.cardIdentify(ctx.request.body.imgUrl.replace(/.\/wxapp\//, "wxapp\/"), 'ci')
    ctx.state.data = cardResult
  } else if (ctx.request.body.action && ctx.request.body.action === 'record') {//语音合成 == 语音识图
    const { data: cardResult } = await getCi.cardIdentify('你好啊你好啊', 'ci')
    ctx.state.data = cardResult
  }
}