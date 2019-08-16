const mongoose = require('mongoose')
var modelSchema = new mongoose.Schema({
    //user email
    filename: { type: String },
    x: { type: Number },
    y: { type: Number },
    z: { type: Number },
    jzwbm: { type: String },
    fwbm: { type: String },
    jddm: { type: String },
    jdmc: { type: String },
    jcwdm: { type: String },
    jcwmc: { type: String },
    jlxmc: { type: String },
    mlph: { type: String },
    sh: { type: String },
    rela: { type: String },
    szc: { type: String },
    relationName: { type: String },
    //create date
    createdAt: { type: Date },
    //update
    updatedAt: { type: Date, default: Date.now },

}, {
        usePushEach: true,
        versionKey: false,
        timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' },
        collection: 'model'
    });


module.exports = mongoose.model('Model', modelSchema);
