
var fs = require('fs'),
    lib = require('./lib'),
    async = require('async'),
    template_dir = __dirname+'/templates/',
    resource,
    resource_name = process.argv[3],
    app_root = process.env.PWD,
    app_path = app_root.split("/"),
    app_name = app_path[app_path.length - 1];


module.exports = function(){

  
  
  // parse resource options from command arguments
  lib.parseArgs(process.argv, function(err, resource) {

    async.parallel({

      // build controller
      controller: function(done) {
        buildController(resource, function(err, controller) {
          if (!err) fs.writeFileSync(app_root+'/app/controllers/'+lib.pluralize(resource_name)+'.js', controller, 'utf-8');
          done(err);
        });
      },

      // build model
      model: function(done) {
        buildModel(resource, function(err, model) {
          if (!err) fs.writeFileSync(app_root+'/app/models/'+resource_name+'.js', model, 'utf-8');
          done(err);
        });
      },

      // build teset
      test: function(done) { 
        buildTest(resource, function(err, test) {
          if (!err) fs.writeFileSync(app_root+'/test/'+resource_name+'.vows.js', test, 'utf-8');
          done(err);
        });
      }
    }, function(err, results) {
      
      if (err) {
        console.log(err);  
      }
      else {
        console.log("finished generating "+ resource_name + " resource");
      }

    });
    
  });

};


/**
 * build new model file using template
 * @param {Array} props the properties for the new resource
 */
function buildModel(resource, callback) {
  
  var props = resource.options['-with'];

  // grab model template
  loadTemplate('model', resource, function(err, model) {
    if (err) return callback(err);

    // add resource name
    model = replaceParams(model);

    // add props
    var props_objects = [];
    if (props && props.length > 0) {
      for (var i = 0; i < props.length; i++) {
        var prop = props[i].split(":");
        if (!prop[1]) prop.push("string");
        props_objects.push("  "+[prop[0]] + " : { type: "+lib.capitalize(prop[1])+" }"); 
      }
    }
    model = model.replace(/_props_/g, "{\n " + props_objects.join(",\n ") + "\n}");

    return callback(null, model);
  });
}



/**
 * build new test file using template
 * @param {Array} props the properties for the new resource
 */
function buildTest(resource, callback) {
  
  var props = resource.options['-with'];

  // grab test template
  loadTemplate('test', resource, function(err, test) {
    if (err) return callback(err);

    // add resource name
    test = replaceParams(test);

    // add props
    var props_objects = [];
    if (props && props.length > 0) {
      for (var i = 0; i < props.length; i++) {
        var prop = props[i].split(":");
        if (!prop[1]) prop.push("string");
        if (prop[1] == "string") {
          props_objects.push([prop[0]] + " : 'test_data'");  
        }
      }
    }
    test = test.replace(/_props_/g, "{ " + props_objects.join(", ") + " }");

    return callback(null, test);

  });
}



/**
 * build new controller file using template
 */
function buildController(resource, callback) {
  // grab model template
  loadTemplate('controller', null, function(err, controller) {
    
    if (err) return callback(err);

    // add resource name
    controller = replaceParams(controller);

    return callback(null, controller);
  });
}




/**
 * loads template from template directory matching name
 * @param {String} name the name of the template to load
 */
function loadTemplate(name, resource, callback) {
  var dir = template_dir;

  if (resource && resource.options['-driver']) {
    dir += resource.options['-driver'][0] + '/';
  }

  require('path').exists(dir+name+'.js', function(exists) {
    if (exists) {
      callback(null, fs.readFileSync(dir+name+'.js', 'utf-8'));
    }
    else {
      callback("Unable to find a generator for this driver: " + resource.options['-driver'][0]);
    }
  });

}


function replaceParams(string) {
  
  // add resource name
  string = string.replace(/_resource_/g, lib.capitalize(resource_name));
  string = string.replace(/_resources_/g, lib.pluralize(lib.capitalize(resource_name)));

  // add appname
  string = string.replace(/_appname_/g, app_name);

  return string;
}

