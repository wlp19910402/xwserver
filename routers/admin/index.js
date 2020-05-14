const Router = require('koa-router');
const re = require('../../lib/re');
const { v4 } = require('uuid');
const config = require('../../config');
let router = new Router();


router.post('/login', async ctx => {
  console.log(ctx.request.fields)
  let { user_name, password } = ctx.request.fields;
  console.log("admin/login");
  let rows = await ctx.db.query('SELECT * FROM sys_user WHERE user_name=?', [ user_name ]);
  console.log(rows);
  if (rows.length == 0) {
    ctx.body = { err: 1, label: 'user_name', msg: "手机号尚未注册过" }
  } else {
    let row = rows[ 0 ];
    console.log(row);
    if (row[ 'password' ] != password) {
      ctx.body = { err: 1, label: 'password', msg: "密码输入错误" }
    } else {
      login_date = Math.floor(Date.now() / 1000)
      token_value = v4().replace(/\-/g, '');
      console.log("()(**((*)__")
      console.log(token_value);
      token_expire = Math.floor((Date.now() + config.TOKEN_AGE) / 1000);
      await ctx.db.query('UPDATE sys_user SET login_date=?,token_value=?,token_expire=? WHERE id =?', [ login_date, token_value, token_expire, row[ 'id' ] ]);
      console.log("hhh")
      ctx.body = { err: 0, token_value, token_expire, user_name, nick_name: row[ 'nick_name' ] };
    }
  }
});

router.post('/reg', async ctx => {
  let post = ctx.request.fields;
  console.log(post);
  if (!re.user_name.test(post[ 'user_name' ])) {
    ctx.body = { err: 1, label: 'user_name', msg: "请输入正确的手机号" }
  } else {
    let rows = await ctx.db.query('SELECT * FROM sys_user WHERE user_name=?', [ post[ 'user_name' ] ]);
    if (rows.length > 0) {
      ctx.body = { err: 1, label: 'user_name', msg: "此手机号已经注册过了" }
    } else {
      register_date = Math.floor(Date.now() / 1000)
      await ctx.db.query(`INSERT INTO sys_user(nick_name,user_name,password,register_date) VALUES(?,?,?,?)`, [ post[ 'nick_name' ], post[ 'user_name' ], post[ 'password' ], register_date ]);
      ctx.body = { err: 0, msg: "注册成功" };
    }
  }
})

router.get('/token/:id', async ctx => {
  let { id } = ctx.params;
  let rows = await ctx.db.query('SELECT nick_name,user_name,token_expire FROM sys_user WHERE token_value=?', [ id ]);
  if (rows.length == 0) {
    ctx.body = { err: 1, msg: "尚未登录，请登录" }
  } else {
    let row = rows[ 0 ];
    let { nick_name, user_name, token_expire } = row;
    if (token_expire < Math.floor(Date.now() / 1000)) {
      ctx.body = { err: 1, msg: "登录时间已过期，请重新登录" }
    } else {
      ctx.body = { err: 0, nick_name, user_name, token_expire, msg: "已经登录过了" }
    }
  }
})

module.exports = router.routes();