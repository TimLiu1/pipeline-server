const Service = require('./service')
const path = require('path')
module.exports = class Controller {
    static async convertModel(ctx) {
       let model = await Service.findOneModel();
       let result = await Service.summaryDaeFile('public/dae')
       result = await Service.generateDaeJson(result)
       result = await Service.addLongitudeLatitude(result)
       result = await Service.convertToB3dm(result)
       result = await Service.generateSummaryTilset()
       ctx.body = result
    }
}