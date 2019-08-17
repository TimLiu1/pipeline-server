const Koa = require('koa');
const app = new Koa();
const cors = require('koa2-cors')
const static = require('koa-static');

app.use(cors())
require('./lib')
require('./app/router')(app)
app.use(static("public", __dirname + "./public"));


app.listen(9001, () => {
    console.log('server listen on 9001')
});