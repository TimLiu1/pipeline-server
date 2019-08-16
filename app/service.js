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

    static async summaryDaeFile(dir) {
        let result = []
        fs.readdirSync(dir).forEach((filename) => {
            var path = dir + "/" + filename
            if (filename.toLocaleLowerCase().includes('dae')) {
                result.push(path)
            } else {
                var stat = fs.statSync(path)
                if (stat && stat.isDirectory()) {
                    walk(path)
                }
            }
        })
        return result
    }







}