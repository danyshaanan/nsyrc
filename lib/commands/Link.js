'use strict';

var chalk = require('chalk')
var read = require('read')
var rek = require('rekuire')

var linksDataUtils = rek('linksDataUtils')
var linksData = rek('linksData')
var shell = rek('shell')

function isAnswerPositive(input, wet) {
  return ~['y','yes'].indexOf(input.toLowerCase()) || (!wet && input.toLowerCase() === '')
}

/////////////////////////

function link(linkData) {
  this.data = linkData
}

link.prototype.run = function(wet) {
  if (!linksDataUtils.varify(this.data)) {
    return console.log(chalk.red('Link invalid! \nMaybe you forgot to connect a drive or to mount a file system?'))
  }
  this.wet = wet
  this.promptForExecution()
}

////////////////////////////////////////////////////////////////////////////////

link.prototype.promptForExecution = function() {
  this.parseCommandArgs()
  read({prompt: this.parsePrompt()}, function(error, input, isDefault) {
    if (error) {
      return console.log(chalk.red('Error handling input, or input invalid!'))
    } else if (isAnswerPositive(input, this.wet)) {
      this.execute()
    }
  }.bind(this))
}

link.prototype.execute = function() {
  shell('rsync', this.commandArgs, this.onExit.bind(this));
}

link.prototype.parseCommandArgs = function() {
  this.commandArgs = [this.data.source, this.data.target, '-Phavyx', '--delete-after', '--dry-run']
  if (this.wet) {
    var dryIndex = this.commandArgs.indexOf('--dry-run')
    if (~dryIndex) {
      this.commandArgs.splice(dryIndex, 1)
    }
  }
}

link.prototype.parsePrompt = function() {
  if (this.wet) {
    return chalk.red('This is for real:\nrsync ' + this.commandArgs.join(' ') + '\n') + 'Execute command? : [NO/yes]'
  }
  return chalk.yellow('Dry run:\nrsync ' + this.commandArgs.join(' ') + '\n') + 'Execute command? : [no/YES]'
}

link.prototype.onExit = function(code) {
  if (code !== 0) {
    return console.log('child process exited with code ' + code)
  } else if (!this.wet) {
    console.log(chalk.yellow('Dry run complete.\n'))
    this.wet = true
    this.promptForExecution()
  } else {
    console.log(chalk.green('Execution complete!\n'))
    linksData.updateCompleteById(this.data.id)
    process.exit() //TODO: why like this?
  }
}

////////////////////////////////////////////////////////////////////////////////


module.exports = {
  link: link
}
