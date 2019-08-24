let Model = require('../model/model');
const fs = require('fs')
const path = require('path');
const mkdirp = require('mkdirp');
const exec = require('child_process').exec;

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

    static async convertDae(url, name) {
        let data = fs.readFileSync(url, 'utf-8');
        let reg = /file.*(?=MAPS)/ig
        let reg1 = /file.*(?=MAP)/ig
        let reg2 = /file.*\\|(?=.*\.JPG)/ig
        if (reg.test(data)) {
            data = data.replace(reg, "")
        } else if (reg1.test(data)) {
            data = data.replace(reg1, "")
        } else {
            data = data.replace(reg2, "")
        }
        data = data.replace(/(?<=sid="matrix">[\-0-9]+\.[0-9]+ ([\-0-9]+\.[0-9]+ ){2})([\-0-9]+\.[0-9]+)/ig, "0.000000")
        data = data.replace(/(?<=sid="matrix">[\-0-9]+\.[0-9]+ ([\-0-9]+\.[0-9]+ ){6})([\-0-9]+\.[0-9]+)/ig, "0.000000")
        fs.writeFileSync(url + name, data, 'utf-8')

    }


    static async generateJSON(longitude, latitude, input, output, json) {
        if (!latitude) {
            let errresult = {
                longitude,
                latitude,
                input,
                output,
                date: new Date()
            }
            fs.appendFileSync('../result.json', JSON.stringify(errresult), 'utf-8');
        }
        console.log("longitude", longitude)
        console.log("latitude", latitude)
        json = json || require('../public/convert.json')
        json.inputs[0]['srs'] = `ENU:${latitude},${longitude}`
<<<<<<< HEAD
        json.inputs[0]['file'] = path.join('./', input)
        json.output.path = path.join('./', output)
=======
        json.inputs[0]['file'] = path.join('./' , input)
        json.output.path =  path.join('./' , output)
>>>>>>> 5d758fe32bc0ff1fd48e82cc297b21da1ca56a4a
        fs.writeFileSync('public/ready.json', JSON.stringify(json), 'utf-8')
    }

    
    static async generateJSONForBatch(longitude, latitude, input, output, json) {
        if (!latitude) {
            let errresult = {
                longitude,
                latitude,
                input,
                output,
                date: new Date()
            }
            fs.appendFileSync('../result.json', JSON.stringify(errresult), 'utf-8');
        }
        json.srs = `ENU:${latitude},${longitude}`
        json.file = path.join('./', input)
        return json
        // fs.writeFileSync('public/ready.json', JSON.stringify(json), 'utf-8')
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
            console.log('processing: ', i)
            const element = data[i];
            mkdirp.sync(element.path.replace('public/dae', 'public/b3dm'))
            await Service.generateJSON(element.x, element.y, element.file, element.path.replace('public/dae', 'public/b3dm'))
            await Service.b3dmToDae()

        }
        return result
    }


    static async convertToB3dmBatch(data) {
        let json = require('../public/convert.json')
        let  x = JSON.parse(JSON.stringify(json))
        let temp = []
        let result = []
        for (let i = 0; i < data.length; i++) {
            console.log("start",i)
            const element = data[i];
            mkdirp.sync(element.path.replace('public/dae', 'public/b3dm'))
            let ok ={ file:
   'public\\dae\\Model_Conversion\\87_col_7\\external\\HPWLKZ_lubanlu509nong10_12hao\\MAX\\HPWLKZ_lubanlu509nong10_12hao.dae',
  nolight: false,
  forceDoubleSide: false,
  customShader: false,
  textureGeometricErrorFactor: 16,
  splitPriority: 'space',
  splitMaxDataSize: 40000000,
  splitUnit: 'mesh',
  srs: 'ENU:31.203585,121.472453',
  srsorigin: '0,0,0',
  filename: 'test0802',
  savefilename: true,
  saveobjectname: true,
  encodeGBK: false,
  simplifyMesh: 'none',
  colorRatio: 1,
  geotransPlan: true }
            let detail = await Service.generateJSONForBatch(element.x, element.y, element.file, element.path.replace('public/dae', 'public/b3dm'), ok)
            temp.push(JSON.parse(JSON.stringify(detail)))
            // if(!isNaN(element.x)){
               console.log('i',detail)
                detail = await Service.generateJSONForBatch(element.x+ 0.000111, element.y+ 0.000111, element.file, element.path.replace('public/dae', 'public/b3dm'), ok)
               console.log('i',detail)
                temp.push(detail)
            // }
          




            

            
        }
            x.inputs = temp
        console.log("--->",temp.length)
        x.output.path = path.join('./public/b3dmall')
        // console.log('xxxx',x)
        fs.writeFileSync('public/ready.json', JSON.stringify(x), 'utf-8')
        await Service.b3dmToDae()
        return result
    }



    static async b3dmToDae() {
        return new Promise(function (resolve, reject) {
            var cmdStr = 'bash bash.sh';
            exec(cmdStr, function (err, stdout, stderr) {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            });
        })
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
        let data = await Service.summaryJsonFile('public/b3dm')
        console.log(data)
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
                    "uri": element.replace('public/b3dm/', '')
                }

            }
            tileset.root.children.push(detail)
        }
        fs.writeFileSync('public/b3dm/tileset.json', JSON.stringify(tileset), 'utf-8')
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


    static async deleteFile(dir) {
        let result = [];
        readdirSync(dir)
        function readdirSync(dir) {
            fs.readdirSync(dir).forEach((filename) => {
                var path = dir + "/" + filename
                var stat = fs.statSync(path)
                if (stat && stat.isDirectory()) {
                    readdirSync(path)
                } else {
                    fs.unlinkSync(path)
                }
            })
        }
        return result
    }





}