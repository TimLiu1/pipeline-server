let Model = require('../model/model');
const fs = require('fs')
const path = require('path');
const mkdirp = require('mkdirp');

module.exports = class Service {
    static async findOneModel() {
        return await Model.findOne({})
    }
    static async addLongitudeLatitude(data) {
        let result = []
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let relationName = new RegExp(element.name)
            let model = await Model.findOne({ relationName })
            if (model) {
                element.x = model.x
                element.y = model.y
            }
            result.push(element)
        }
        return result
    }

    static async summaryDaeFile(dir) {
        let result = [];
        readdirSync(dir)
        function readdirSync(dir) {
            fs.readdirSync(dir).forEach((filename) => {
                var path = dir + "/" + filename
                if (filename.toLocaleLowerCase().includes('dae')) {
                    result.push(path)
                } else {
                    if (!filename.includes('DS_Store')) {
                        var stat = fs.statSync(path)
                        if (stat && stat.isDirectory()) {
                            readdirSync(path)
                        }
                    }

                }
            })
        }
        return result
    }


    static async generateJSON(longitude, latitude, input, output, json) {
        json = json || require('../public/convert.json')
        json.inputs[0]['srs'] = `ENU:${latitude},${longitude}`
        json.inputs[0]['file'] = input
        json.output.path = output
        fs.writeFileSync('public/ready.json', JSON.stringify(json), 'utf-8')
    }

    static async generateDaeJson(data) {
        let result = []
        data.forEach((e) => {
            let detail = {
                daeName: path.basename(e),
                name: path.basename(e).replace('.dae', ''),
                path: path.dirname(e),
                file: e
            }
            result.push(detail)
        })
        return result
    }

    static async convertToB3dm(data) {
        let result = []
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            mkdirp.sync(element.path.replace('public/dae', 'public/b3dm'))
            await Service.generateJSON(element.x, element.y, element.file, element.path)
        }
        return result
    }

    static async b3dmToDae() {

    }

    static async generateSummaryTilset() {
        let tileset = {
            "asset": {
                "generatetool": "cesiumlab@www.cesiumlab.com",
                "gltfUpAxis": "Z",
                "version": "1.0"
            },
            "properties": {

            },
            "geometricError": 800,
            "root": {
                "boundingVolume": {
                    "region": [
                        2.1197050411731104,
                        0.5442527266222308,
                        2.1207950411731105,
                        0.5454927266222308,
                        0,
                        1000
                    ]
                },
                "geometricError": 300.9730159305084,
                "refine": "ADD",
                "children": []
            }
        }
        let data = await Service.summaryJsonFile('public/dae')
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            let detail = {
                "boundingVolume": {
                    "region": [
                        2.1197050411731104,
                        0.5442527266222308,
                        2.1207950411731104,
                        0.5454927266222308,
                        0,
                        1000
                    ]
                },
                "geometricError": 0,
                "content": {
                    "uri": element
                }

            }
            tileset.root.children.push(detail)
        }
        fs.writeFileSync('public/dae/tileset.json', JSON.stringify(tileset), 'utf-8')
    }



    static async summaryJsonFile(dir) {
        let result = [];
        readdirSync(dir)
        function readdirSync(dir) {
            fs.readdirSync(dir).forEach((filename) => {
                var path = dir + "/" + filename
                if (filename === "tileset.json") {
                    result.push(path)
                } else {
                    if (!filename.includes('DS_Store')) {
                        var stat = fs.statSync(path)
                        if (stat && stat.isDirectory()) {
                            readdirSync(path)
                        }
                    }

                }
            })
        }
        return result
    }




}