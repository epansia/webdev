//export `heroku config -s`
module.exports = function() {
    var connectionString =  null;

    if (process.env.MONGODB_URI) {
        connectionString = 'mongodb://<admin>:<15926>@ds137141.mlab.com:37141/heroku_xd08mp2p';
    }
    else
    {
        connectionString = 'mongodb://localhost:27017/cs5610'
    }

    var mongoose = require('mongoose');
    mongoose.connect(connectionString, {
        useMongoClient: true
    });
    mongoose.Promise = require('q').Promise;

    var db = mongoose.connection;
    db.on('error', console.error.bind(console, 'connection error:'));
    db.once('open', function() {
        // we're connected!
    });

    var userModel = require("./user/user.model.server.js")(mongoose);
    var websiteModel = require("./website/website.model.server.js")(mongoose, userModel);
    var pageModel =  require("./page/page.model.server.js")(mongoose, websiteModel);
    var widgetModel = require("./widget/widget.model.server.js")(mongoose, pageModel);

    var models = {
        'userModel' : userModel,
        'websiteModel' : websiteModel,
        'pageModel' : pageModel,
        'widgetModel' : widgetModel
    };

    return models;
};