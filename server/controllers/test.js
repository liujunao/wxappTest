module.exports  = async function (ctx, next) {
 
    const title = 'home'
   ctx.state = {
   title: 'fi'
  }
  await ctx.render('index', {
    title
  })
}
