'use strict';

var clc = require('cli-color');
var fs = require('fs');
var pathResolve = require('path').resolve;
var rek = require('rekuire');
var coloredTimeAgo = rek('coloredTimeAgo');



/////// Private ///////////////////

var PathType = {
  NONE: false,
  FILE: 'file',
  DIR: 'dir',
  DIRECTORY: 'dir',
  REMOTE: 'remote'
};

var PathStatus = {
  MISSING: 'missing',
  REMOTE: 'remote',
  EXISTS: 'exists'
};

//////////

function ProcessedString(str, funcArray) {
  this.str = str;
  this.length = this.str.length;
  this.funcArray = (funcArray instanceof Array) ? funcArray : [funcArray];
}

ProcessedString.prototype.toString = function() {
  return this.funcArray.filter(Boolean).reduce(function(prev, curr) { return curr(prev); }, this.str);
};

//////////

function remotePath(path) {
  return /[^\/]+:/.test(path);
}

function pathType(path) {
  if (remotePath(path)) return PathType.REMOTE;
  if (fs.existsSync(path)) {
    if (fs.lstatSync(path).isDirectory()) return PathType.DIR;
    if (fs.lstatSync(path).isFile()) return PathType.FILE;
  }
  return PathType.NONE;
}

function formatPath(path) {
  var type = pathType(path);
  if (type == PathType.REMOTE) {
    return path;// + (/[\/:][^\.\/]+$/.test(path) ? '/' : '');
  } else {
    return pathResolve(path) + (type == PathType.DIR ? '/' : '');
  }
}

function pathStatus(path) {
  var type = pathType(path);
  if (type == PathType.REMOTE) return PathStatus.REMOTE;
  if (type == PathType.DIR) return PathStatus.EXISTS;
  if (type == PathType.FILE) return PathStatus.EXISTS;
  return PathStatus.MISSING;
}

function pathColorFunction(path) {
  var status = pathStatus(path);
  if (status == PathStatus.REMOTE) return clc.yellow;
  if (status == PathStatus.EXISTS) return clc.green;
  if (status == PathStatus.MISSING) return clc.xterm(52);
}

function cliColorPath(path) {
  return new ProcessedString(path, pathColorFunction(path));
}

function printedData(link) {
  return [link.id+':', cliColorPath(link.source), '-->', cliColorPath(link.target), coloredTimeAgo.coloredTimeAgo(link.lastSynced)];
}

function multiplyString(str,n) {
  return Array.apply(null, new Array(n)).map(function(){return str;}).join('');
}

function pad(path, len, char) {
  return path + multiplyString(char[0], len - path.length);
}

/////// Exported ///////////////////

function varify(link) {
  var sourceType = pathType(link.source);
  var targetType = pathType(link.target);
  if (sourceType == PathType.REMOTE && targetType == PathType.REMOTE) return false;
  if (!sourceType || !targetType) return false;
  return link;
}

function format(link) {
  link.source = formatPath(link.source);
  link.target = formatPath(link.target);
  return varify(link);
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


module.exports = {
  format: format,
  varify: varify,
  stringify: stringify,
  stringifyList: stringifyList
};
