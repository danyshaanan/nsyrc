'use strict';

var rek = require('rekuire')
var clc = rek('cli-color')

var waitingTime = 0

function start(message) {
  clearInterval(waitingTime)
  process.stdout.write(clc.yellow(message))
  waitingTime = setInterval(function(){
    process.stdout.write(clc.yellow('.'))
  }, 100)
}


function stop(message) {
  process.stdout.write(clc.yellow(message + '\n'))
  clearInterval(waitingTime)
}

module.exports = {
  start : start,
  stop: stop
}
