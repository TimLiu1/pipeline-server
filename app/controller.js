const Service = require('./service')
const path = require('path')
module.exports = class Controller {
    static async convertModel(ctx) {
       let model = await Service.findOneModel();
       Service.generateJSON(model.x,model.y)
       let result = await Service.summaryDaeFile('public/dae')
       result = await Service.generateDaeJson(result)
       result = await Service.addLongitudeLatitude(result)
       ctx.body = result
    }
}