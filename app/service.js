let model = require('../model/model');
const fs = require('fs')

module.exports = class Service {
    static async findOneModel() {
        return await model.findOne({})
    }

    static async generateJSON(longitude, latitude, input, output, json) {
        json = json || require('../public/convert.json')
        json.inputs[0]['srs'] = `ENU:${latitude},${longitude}`
        json.inputs[0]['file'] = input
        json.output.path = output
        fs.writeFileSync('public/ready.json', JSON.stringify(json), 'utf-8')
    }
}