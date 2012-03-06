
var app_root = process.env.PWD;

module.exports = function(){

  console.log("generating "+ process.argv[4] + " resource");
  
  require('./lib').parseArgs(process.argv, function(err, resource) {
    console.log('parsed options: ');
    console.log(resource);
  });

};