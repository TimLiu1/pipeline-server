var Router = require('koa-router');
var router = new Router();
var Controller = require('./controller')

module.exports = (app) => {
    app.use(router.routes())
        .use(router.allowedMethods());

}
router.get('/convertModel', Controller.convertModel);
router.get('/convertModelBatch', Controller.convertModelBatch);
