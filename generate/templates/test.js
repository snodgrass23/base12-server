
var vows = require('vows'),
    assert = require('assert'),
    _resource_Model = require('../app/models/_resource_');


// test descriptions
vows.describe('_resource_ model test').addBatch({
  
  // example test
  'remove all _resources_' : {
    topic: function() {
      this.callback(null, 2);
    },
    'errors should be null': function(err, result) {
      assert.equal(result, 2);
    }
  }
  
})['export'](module);