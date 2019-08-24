const Service = require('./service')
const path = require('path')
module.exports = class Controller {
   static async convertModel(ctx) {
      await Service.deleteFile('public/b3dm');
      let result = await Service.summaryDaeFile('public/dae')
      result = await Service.generateDaeJson(result)
      result = await Service.addLongitudeLatitude(result)
      result = await Service.convertToB3dm(result)
      result = await Service.generateSummaryTilset()
      ctx.body = [{
         status: true,
         descriptopn: '生成转换资料json',
         title: '生成转换资料json',
      }, {
         status: true,
         descriptopn: 'dae转换b3dm',
         title: 'dae转换b3dm'
      },
      {
         status: true,
         descriptopn: '生成总tileset.json文件',
         title: '生成总tileset.json文件'
      }
      ]
   }


   static async convertModelBatch(ctx) {
      await Service.deleteFile('public/b3dm');
      let result = await Service.summaryDaeFile('public/dae')
      result = await Service.generateDaeJson(result)
      result = await Service.addLongitudeLatitude(result)
      result = await Service.convertToB3dmBatch(result)
      // result = await Service.generateSummaryTilset()
      ctx.body = [{
         status: true,
         descriptopn: '生成转换资料json',
         title: '生成转换资料json',
      }, {
         status: true,
         descriptopn: 'dae转换b3dm',
         title: 'dae转换b3dm'
      },
      {
         status: true,
         descriptopn: '生成总tileset.json文件',
         title: '生成总tileset.json文件'
      }
      ]
   }


   static async daeModelPipeLine(ctx) {
      let result = await Service.summaryDaeFile('public/dae')
   }
}