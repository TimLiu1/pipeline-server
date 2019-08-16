const Service = require('./service')

module.exports = class Controller {
    static async convertModel(ctx) {
       let model = await Service.findOneModel();
       Service.generateJSON(model.x,model.y)
    }
}