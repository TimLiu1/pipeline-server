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
      ctx.body = [{
         status: true,
         name: '生成转换资料json'
      }, {
         status: true,
         name: 'dae转换b3dm'
      },
      {
         status: true,
         name: '生成总tileset.json文件'
      }
      ]
   }


   static async daeModelPipeLine(ctx) {
      let result = await Service.summaryDaeFile('public/dae')
   }
}