const Koa = require('koa');
const app = new Koa();
require('./lib')
require('./app/router')(app)
app.use(async ctx => {
    ctx.body = 'Hello World';
});


app.listen(9001, () => {
    console.log('server listen on  9001')
});