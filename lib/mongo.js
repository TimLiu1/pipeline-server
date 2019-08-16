const mongoose = require("mongoose")
var db = mongoose.connection;
mongoose.connect(`mongodb://${config.MONGODB.options.user}:${config.MONGODB.options.pass}@${config.MONGODB.host}/${config.MONGODB.database}`, config.MONGODB.options)
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function () {
    console.log("we're connected!")
});

