"use strict";

var clc = require('cli-color');
var fs = require('fs');
// var rek = require('rekuire');
var pathResolve = require('path').resolve;
var moment = require('moment');

module.exports = {
  format: format,
  varify: varify,
  stringify: stringify,
  stringifyList: stringifyList
};

/////// Exported ///////////////////

function format(link) {
  link.source = formatPath(link.source);
  link.target = formatPath(link.target);
  return varify(link);
}

function varify(link) {
  var sourceType = pathType(link.source);
  var targetType = pathType(link.target);
  if (sourceType == PathType.REMOTE && targetType == PathType.REMOTE) return false;
  if (!sourceType || !targetType) return false;
  return link;
}

function stringify(link) {
  return printedData(link).join(' ');
}

function stringifyList(list) {
  var table = list.map(printedData);
  var maxLengths = table.reduce(function(prev, curr) {
    return curr.map(function(v,i) { return Math.max(v.length, prev ? prev[i] : 0) });
  }, null);
  return table.map(function(row) {
    return row.map(function(val,i) {
      return pad(val,maxLengths[i], '.');
    }).join(' ');
  }).join('\n');
}

////////////////////////////////////////////////////////////////////////////////

/////// Private ///////////////////

var PathType = {
  NONE: false,
  FILE: 'file',
  DIR: 'dir',
  DIRECTORY: 'dir',
  REMOTE: 'remote'
}

var PathStatus = {
  MISSING: 'missing',
  REMOTE: 'remote',
  EXISTS: 'exists'
}

var LinkUpdateStatus = {
  NEW: 'new',
  SEMI: 'semi',
  OLD: 'old'
}

//////////

function ProcessedString(str, funcArray) {
  this.str = str;
  this.length = this.str.length;
  this.funcArray = (funcArray instanceof Array) ? funcArray : [funcArray];
}

ProcessedString.prototype.toString = function() {
  return this.funcArray.filter(Boolean).reduce(function(prev, curr) { return curr(prev); }, this.str);
}

//////////

function pathType(path) {
  if (remotePath(path)) return PathType.REMOTE;
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) return PathType.DIR;
    if (fs.lstatSync(path).isFile()) return PathType.FILE;
  }
  return PathType.NONE;
}

function getUpdateStatus(unixTimeStamp) {
  var secondsAgo = moment().diff(moment(unixTimeStamp || 0)) / 1000;
  if (secondsAgo > 60*60*24*7) { //TODO: this time period (week) should be configurable.
    return LinkUpdateStatus.OLD;
  } else if (secondsAgo > 60*60*24) { //TODO: this time period (day) should be configurable.
    return LinkUpdateStatus.SEMI;
  }
  return LinkUpdateStatus.NEW;
}

function formatPath(path) {
  var type = pathType(path);
  if (type == PathType.REMOTE) {
    return path + (/[\/:][^\.\/]+$/.test(path) ? '/' : '');
  } else {
    return pathResolve(path) + (type == PathType.DIR ? '/' : '');
  }
}

function remotePath(path) {
  return /[^\/]+:/.test(path);
}

function pathStatus(path) {
  var type = pathType(path);
  if (type == PathType.REMOTE) return PathStatus.REMOTE;
  if (type == PathType.DIR) return PathStatus.EXISTS;
  if (type == PathType.FILE) return PathStatus.EXISTS;
  return PathStatus.MISSING;
}

function printedData(link) {
  return [link.id+":", cliColorPath(link.source), "-->", cliColorPath(link.target), cliTimeAgo(link.lastSynced)];
}

function pad(path, len, char) {
  return path + multiplyString(char[0], len - path.length);
}

function multiplyString(str,n) {
  return Array.apply(null, Array(n)).map(function(){return str;}).join('');
}

function cliTimeAgo(unixTimeStamp) {
  return new ProcessedString(unixTimeStamp ? moment(unixTimeStamp).fromNow() : "Never", timeAgoColorFunction(unixTimeStamp));
}

function timeAgoColorFunction(unixTimeStamp) {
  var updateStatus = getUpdateStatus(unixTimeStamp);
  if (updateStatus == LinkUpdateStatus.OLD) return clc.red;
  if (updateStatus == LinkUpdateStatus.SEMI) return clc.yellow;
  if (updateStatus == LinkUpdateStatus.NEW) return clc.white;
}


function cliColorPath(path) {
  return new ProcessedString(path, pathColorFunction(path));
}

function pathColorFunction(path) {
  var status = pathStatus(path);
  if (status == PathStatus.REMOTE) return clc.yellow;
  if (status == PathStatus.EXISTS) return clc.green;
  if (status == PathStatus.MISSING) return clc.xterm(52);
}




