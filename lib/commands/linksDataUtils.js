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
    if (sourceType == PathType.NONE) return false;
    if (targetType == PathType.NONE) return false;
    return link;
}

function stringify(link) {
    return printedData(link).join(' ');
}

function stringifyList(list) {
    var table = list.map(printedData);
    var maxLengths = [];
    for (var key in table) {
      for (var i in table[key]) {
        maxLengths[i] = Math.max(maxLengths[i] || 0, realLength(table[key][i]));
      }
    }
    // Another way to calculate maxLength; more fun, but heckish as hell. This is here as an example for the curious reader:
    // var maxLengths = table[0].map(function(v,columnIndex) { return table.reduce(function(max, row) { return Math.max(max, realLength(row[columnIndex])); }, 0); });
    return table.map(function(row) {
      return row.map(function(val,i) {
        return pad(val,maxLengths[i]);
      }).join(' ');
    }).join('\n');
}

////////////////////////////////////////////////////////////////////////////////

/////// Private ///////////////////

var PathType = {
  NONE: 'none',
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

function pathType(path) {
  if (remotePath(path)) return PathType.REMOTE;
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) return PathType.DIR;
    if (fs.lstatSync(path).isFile()) return PathType.FILE;
  }
  return PathType.NONE;
}

function getTimeAgoString(unixTimeStamp) {
    return unixTimeStamp ? moment(unixTimeStamp).fromNow() : "Never";
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
      if (/[\/:][^\.\/]+$/.test(path)) { //does path end in name without '.' not sufixed by '/'
        path += '/';
      }
      return path;
    } else {
      path = pathResolve(path);
      if (type == PathType.DIR) {
        path += '/';
      }
      return path;
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

function printedData(link) { //TODO: this should return array of {str:"...","colorFunk":clc.red}, so that string maipulation be easier
  return [link.id+":", cliColorPath(link.source), "-->", cliColorPath(link.target), cliTimeAgo(link.lastSynced)];
}

function realLength(path) { //TODO: this should be removed, see comment on printedData
  return path.replace(/.\[[0-9;]+m/g,'').length;
}

function pad(path, len) {
  return path + multiplyString('.', len - realLength(path));
}

function multiplyString(str,n) {
  return Array.apply(null, Array(n)).map(function(){return str;}).join('');
}

function cliTimeAgo(unixTimeStamp) {
    var timeAgo = ["(",getTimeAgoString(unixTimeStamp),")"].join("");
    var updateStatus = getUpdateStatus(unixTimeStamp);
    if (updateStatus == LinkUpdateStatus.OLD) return clc.red(timeAgo);
    if (updateStatus == LinkUpdateStatus.SEMI) return clc.yellow(timeAgo);
    if (updateStatus == LinkUpdateStatus.NEW) return timeAgo;
    return timeAgo;
}

function cliColorPath(path) {
  var status = pathStatus(path);
  if (status == PathStatus.REMOTE) return clc.yellow(path);
  if (status == PathStatus.EXISTS) return clc.green(path);
  if (status == PathStatus.MISSING) return clc.xterm(52)(path);
  return path;
}




