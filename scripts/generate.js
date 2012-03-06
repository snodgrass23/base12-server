
module.exports = function(){

  require('path').exists(__dirname+'/../generate/'+process.argv[3]+'.js', function(exists) {
    if (exists) {
      require(__dirname+'/../generate/'+process.argv[3])();
    }
    else {
      console.log("Unable to find a generater for this command: " + process.argv[3]); 
    }
  });

};