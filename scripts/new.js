var exec = require('child_process').exec,
    pwd = process.env.PWD,
    app_root = pwd+'/'+process.argv[3];

module.exports = function(){
  console.log("building new app in "+app_root);

  var commands = [
    {label:"Cloning base app", cmd:"git clone git://github.com/Skookum/base12.git "+app_root},
    {label:"Renaming git remote from origin", cmd:"cd "+ app_root +" && git remote rename origin upstream"},
    {label:"running npm install", cmd:"cd "+ app_root +" && npm install"}
  ];


  require('async').forEachSeries(commands, function(c, next) {
    console.log("=====================================");
    if (c.label) console.log(c.label);
    exec(c.cmd, function(err, stdout, stderr) {
      if (err) {
        console.log("error:");
        console.log(err);
      }
      if (stderr) console.log(stderr);
      if (stdout) console.log(stdout);
      next();
    });
  }, function() {
    console.log("========================");
    console.log("Next: try your new base12 project!");
    console.log("cd "+process.argv[3]);
    console.log("node run");
  });


};
