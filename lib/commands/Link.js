"use strict";

var clc = require('cli-color');
var read = require('read')
var spawn = require('child_process').spawn;
var rek = require('rekuire');

var linksDataUtils = rek('linksDataUtils');

module.exports = {
  link: link
};

function link(linkData) {
  this.data = linkData;
}

link.prototype.run = function(wet) {
  if (!linksDataUtils.varify(this.data)) {
    return console.log(clc.red("Link invalid!"));
  }
  this.wet = wet;
  this.promptForExecution();
}

////////////////////////////////////////////////////////////////////////////////

link.prototype.promptForExecution = function() {
  this.parseCommandArgs();
  read({prompt: this.parsePrompt()}, function(error, input, isDefault) {
    if (error) {
      return console.log(clc.red("Error handling input, or input invalid!"));
    } else if (isAnswerPositive(input, this.wet)) {
      this.execute();
    }
  }.bind(this));
}

link.prototype.execute = function() {
  var command = spawn('rsync', this.commandArgs);
  command.stdout.on('data', function(data) { console.log(data.toString().replace("\n","")); } );
  command.stderr.on('data', function(data) { console.log(data.toString().replace("\n","")); } );
  command.on('exit', function (code) {
    if (code !== 0) {
      return console.log('child process exited with code ' + code);
    } else if (!this.wet) {
      this.wet = true;
      this.promptForExecution();
    } else {
      //TODO: Wet was done, update lastUpdatedTime
    }
  }.bind(this));
}

link.prototype.parseCommandArgs = function() {
  this.commandArgs = [this.data.source, this.data.target, "-Phavyx", "--delete-after", "--dry-run"];
  if (this.wet) {
    var dryIndex = this.commandArgs.indexOf("--dry-run");
    if (~dryIndex) {
      this.commandArgs.splice(dryIndex, 1);
    }
  }
}

link.prototype.parsePrompt = function() {
  return [(this.wet ? clc.red : clc.yellow)("rsync " + this.commandArgs.join(" ")), "\nExecute command? : ", this.wet ? "[N/yes]" : "[N/y]", "\n"].join(" ");
}

////////////////////////////////////////////////////////////////////////////////

function isAnswerPositive(input, wet) {
  return (wet && input.toLowerCase() == "yes") || (!wet &&  input.toLowerCase() == "y");
}





