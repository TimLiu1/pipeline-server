const Koa = require('koa');
const app = new Koa();
const static = require('koa-static');

require('./lib')
require('./app/router')(app)
app.use(static("public", __dirname + "./public"));


app.listen(9001, () => {
    console.log('server listen on  9001')
});