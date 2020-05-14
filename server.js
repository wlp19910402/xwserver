const Koa = require('koa');
const mysql = require('mysql');
const router = require('./routers');
const co = require('co-mysql');
const body = require('koa-better-body');

let conn = mysql.createPool({
  host: '39.105.50.203',
  port: 3306,
  user: 'root',
  password: 'admin',
  database: 'wlp6897'
});

let server = new Koa()
server.listen(8080);
server.context.db = co(conn);

let obj = body({ uploadDir: 'upload' });
server.use(obj);

server.use(async (ctx, next) => {
  ctx.set('Access-Control-Allow-Origin', '*')
  ctx.set('Access-Control-Allow-Credentials', 'true')
  ctx.set("Access-Control-Allow-Headers", "Content-Type,Access-Control-Allow-Headers,Content-Length,Accept,Authorization,X-Requested-With")
  ctx.set("Access-Control-Allow-Methods", "PUT,POST,GET,DELETE,OPTIONS")
  if (ctx.request.method == "OPTIONS") {
    ctx.status = 200
    return;
  } else {
    await next();
  }
})

server.use(router);

