const Koa = require('koa')
const views = require('koa-views')
const { resolve } = require('path')

const app = new Koa()

// 集成views的中间件
app.use(views(resolve(__dirname, './views'), {
  extension: 'pug'
}))


app.use(async (ctx, next) => {
  await ctx.render('index', {
    name: 'u14e'
  })
})

app.listen(3000)

console.log('Server running on port 3000.')