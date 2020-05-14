const Router = require('koa-router');

let router = new Router();

router.use(async (ctx, next) => {
  // try {
  await next();
  // } catch (e) {
  //   console.log(e);
  //   ctx.body = "服务器报错";
  // }
});

router.get('/', ctx => {
  ctx.body = "成功进入服务端了"
})
router.use('/admin', require('./admin'));

module.exports = router.routes();