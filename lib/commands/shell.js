'use strict';

var spawn = require('child_process').spawn;

module.exports = function shell(cmd, opts, callback) {
  process.stdin.pause();
  var p = spawn(cmd, opts, {
    customFds: [0, 1, 2]
  });
  return p.on('exit', function(code) {
    process.stdin.resume();
    return callback(code);
  });
};
