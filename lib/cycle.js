var fork = require('child_process').fork;
var fs = require('fs');
var basename = require('path').basename;
var extname = require('path').extname;

var extensions = ['.js'];
var interval = 100;

var app, app_path, arg;

module.exports = function(dir, filename, max) {
  app_path = dir + '/' + filename;
  arg = max;
  monitor(dir);
  run();
};

function monitor(dir) {
  var files = fs.readdirSync(dir);
  files.forEach(traverse);
}

function run() {
  console.log('  \033[36mrunning server...\033[0m');
  app = fork(app_path, [arg]);
  app.once('exit', function(code, signal) {
    run();
  });
}

function kill() {
  console.log('  \033[36mkilling server...\033[0m');
  app.kill('SIGKILL');
}

// traverse file if it is a directory
// otherwise setup the watcher
function traverse(file) {
  fs.stat(file, function(err, stat){
    if (!err) {
      if (stat.isDirectory()) {
        if (~exports.ignoreDirectories.indexOf(basename(file))) return;
        fs.readdir(file, function(err, files){
          files.map(function(f){
            return file + '/' + f;
          }).forEach(traverse);
        });
      } else {
        watch(file);
      }
    }
    else {
      console.log("ERR Looking at file in reloader:", err);
    }
  });
}

// watch file for changes
function watch(file) {
  if (!~extensions.indexOf(extname(file))) return;
  fs.watchFile(file, { interval: interval }, function(curr, prev){
    if (curr.mtime > prev.mtime) {
      console.log('  \033[36mchanged\033[0m \033[90m- %s\033[0m', file);
      kill();
    }
  });
}

exports.ignoreDirectories = ['node_modules', 'support', 'test', 'bin', 'public', '.git'];