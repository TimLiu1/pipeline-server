const Service = require('./service')

module.exports = class Controller {
    static async convertModel(ctx) {
        ctx.body = await Service.findOneModel();
    }
}