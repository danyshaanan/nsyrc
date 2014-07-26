'use strict';

var clc = require('cli-color')
var rek = require('rekuire')

// var waiting = rek('waiting')
var linksData = rek('linksData')
var link = rek('Link').link
var linksDataUtils = rek('linksDataUtils')

function currentDirectory() {
  linksData.currentDirectory()
}

function createLink(source, target) {
  linksData.add({ source: source, target: target })
}

function unlink(id) {
  var res = linksData.removeById(id)
  if (!res) {
    return console.log(clc.red('Invalid id or another problem. (id: ' + id + ').'))
  }
  return console.log(clc.green('Removed id #' + id))
}

function emptyTrash() {
  linksData.emptyTrash()
  console.log(clc.green('Unlinked links removed from trash.'))
}

function show() {
  var all = linksData.all()
  if (all.length === 0) {
    console.log(clc.yellow('There aren\'t any links defined yet, try something like this:'))
    console.log(clc.green('nsyrc --link ~/thisfolder/ ~/thatfolder/'))
    return
  }
  console.log(linksDataUtils.stringifyList(all))
}

function run(id, wet) {
  var linkData = linksData.get(id)
  if (!linkData) {
    return console.log(clc.red('Bad id!'))
  }
  var linkItem = new link(linkData)
  linkItem.run(wet)
}

module.exports = {
  currentDirectory: currentDirectory,
  createLink: createLink,
  unlink: unlink,
  emptyTrash: emptyTrash,
  show: show,
  run: run
}
