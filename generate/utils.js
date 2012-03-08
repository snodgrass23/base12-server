var fs = require('fs');

module.exports = {
  dir: process.env.PWD,
  get_config: function() {
    return require(this.dir + '/.env.json');
  },
  set_config: function(obj) {
    fs.writeFileSync('./.env.json', JSON.stringify(obj, null, 2), 'utf-8');
  }
};