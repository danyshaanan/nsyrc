#!/usr/bin/env node

'use strict';

var cli = require('commander')
var chalk = require('chalk')
var rek = require('rekuire')
var version = rek('package.json').version

var nsyrc = rek('nsyrc')

cli
  .version(version)
  .usage('[ [-r] <id> | -l <source> <target> | -t <id> ]')
  .option('-l, --link', 'create a link from <source> to <target>')
  .option('-r, --run <id>', 'run a link by id (can be used without "-r", as in "nsyrc 1")', parseInt)
  .option('-n, --next', 'run the first link that hasn\'t been synced in the last 24 hours')
  .option('-t, --trash <id>', 'remove a link by id', parseInt)
  .option('-e, --empty', 'remove all unlinked links from the trash')
  .option('-w, --wet', 'skip dry-run')
  .option('-c, --current-directory', 'use the .nsyrc file that is in the current directory')
  .parse(process.argv)

var targets = process.argv.slice(2).filter(function(v) { return v.indexOf('-') !== 0 })


if (cli.currentDirectory) nsyrc.currentDirectory()


if (cli.link) {
  if (targets.length == 2) {
    nsyrc.createLink(targets[0], targets[1])
  } else {
    console.log(chalk.red('"--link" takes two arguments! Try again, like so: "nsyrc --link <source> <target>"'))
  }
} else if (cli.trash) {
  nsyrc.unlink(cli.trash)
} else if (cli.empty) {
  nsyrc.emptyTrash()
} else if (cli.run || targets.length == 1 || cli.next) {
  nsyrc.run(cli.run || parseInt(targets[0]), cli.wet)
} else {
  nsyrc.show()
}
