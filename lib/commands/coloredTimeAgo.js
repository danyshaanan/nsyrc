"use strict";

var clc = require('cli-color');
var moment = require('moment');

module.exports = {
  coloredTimeAgo: coloredTimeAgo
};

var secondsInWeek = 60*60*24*7;
var secondsInDay = 60*60*24;

function coloredTimeAgo(unixTimeStamp) {
  var colorFunction = utsColorFunction(unixTimeStamp);
  var timeAgo = utsToAgo(unixTimeStamp);
  return colorFunction(timeAgo);
}

function utsToAgo(unixTimeStamp) {
  return unixTimeStamp ? moment(unixTimeStamp).fromNow() : "Never";
}

function utsColorFunction(unixTimeStamp) {
  var secondsAgo = moment().diff(moment(unixTimeStamp || 0)) / 1000;
  if      (secondsAgo > secondsInWeek)  return clc.red;
  else if (secondsAgo > secondsInDay) return clc.yellow;
  else return clc.white;
}