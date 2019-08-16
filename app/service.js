let model = require('../model/model');


module.exports = class Service{
    static async findOneModel(){
        return await model.findOne({})
    }
}