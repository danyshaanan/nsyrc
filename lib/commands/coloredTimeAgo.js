'use strict';

var chalk = require('chalk')
var moment = require('moment')

var secondsInWeek = 60*60*24*7
var secondsInDay = 60*60*24

function utsColorFunction(unixTimeStamp) {
  var secondsAgo = moment().diff(moment(unixTimeStamp || 0)) / 1000
  if      (secondsAgo > secondsInWeek)  return chalk.red
  else if (secondsAgo > secondsInDay) return chalk.yellow
  else return chalk.white
}

function utsToAgo(unixTimeStamp) {
  return unixTimeStamp ? moment(unixTimeStamp).fromNow() : 'Never'
}

function coloredTimeAgo(unixTimeStamp) {
  var colorFunction = utsColorFunction(unixTimeStamp)
  var timeAgo = utsToAgo(unixTimeStamp)
  return colorFunction(timeAgo)
}

module.exports = {
  coloredTimeAgo: coloredTimeAgo
}
