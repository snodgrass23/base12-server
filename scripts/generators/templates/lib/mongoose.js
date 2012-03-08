// Connect to mongodb

var mongoose = require('mongoose');

module.exports = function(app) {
  mongoose.connect('mongodb://' + app.config.mongo.host + '/' + app.config.mongo.db, function(err) {
    if (err) throw new Error(err.message);
  });
};
