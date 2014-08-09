'use strict';

var chalk = require('chalk')
var inquirer = require('inquirer')
var rek = require('rekuire')

var linksDataUtils = rek('linksDataUtils')
var linksData = rek('linksData')
var shell = rek('shell')

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
  var inquiryName = 'run?'
  inquirer.prompt({ type: 'confirm', name: inquiryName, message: this.parsePrompt(), default: !this.wet }, function(answers) {
    if (answers[inquiryName]) this.execute()
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
  var color = this.wet ? chalk.red : chalk.yellow
  return 'Execute command ' + color('"rsync ' + this.commandArgs.join(' ')) + '"?'
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
