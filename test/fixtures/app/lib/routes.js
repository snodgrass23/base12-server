//var resource = require('express-resource');

module.exports = function(app) {
  
  // Home
  //app.resource(app.controllers.home);

  app.get('/', app.controllers.home.index);

  app.resource('first', function() {
    this.resource('second', function() {
      this.resource('third')
        .map('innersub');
    });
    this.resource('ii');
  })
  .map('sub1')
  .map('subtwo', 'sub2');

};