var utils = require('./utils');

module.exports = function(options) {
  var dir = process.env.PWD;
  var current_config = require(dir + '/.env.json');

  var default_config = {
    mongoose: {
      host: 'localhost',
      db: current_config.name
    }
  };


};