'use strict';

// var path = require('path')
var chalk = require('chalk')
var rek = require('rekuire')

var linksDataUtils = rek('linksDataUtils')
var SettingsFacade = rek('SettingsFacade')
var settings = new SettingsFacade((process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE) + '/.nsyrc')

///////////////

function linkUpdatedSince(link, uts) {
  return link.lastSynced && link.lastSynced > uts
}

function getNextToSync(links) {
  var now = new Date()
  var aDayAgo = now.getTime() - 1000*60*60*24
  for (var i in links) {
    if (!linkUpdatedSince(links[i], aDayAgo)) {
      return links[i]
    }
  }
  console.log(chalk.green('Seems like everything was synced in the last 24 hours! :]'))
  process.exit()
}

function getMaxId() {
  var links = settings.read('links') || []
  var trash = settings.read('trash') || []
  var maxId = links.concat(trash).reduce(function(prev, curr, index, array) {
    return Math.max(prev, curr.id)
  }, settings.read('maxid') || 0)
  return maxId
}

////////////////////////////////

function currentDirectory() {
  settings = new SettingsFacade(process.cwd() + '/.nsyrc')
}

function all() {
  return settings.read('links') || []
}

function add(link) {
  link = linksDataUtils.format(link)
  if (!link) {
    console.log(chalk.red('Link invalid!'))
    return false
  }
  var links = settings.read('links') || []
  var dupe = links.some(function(v,i,a) {
    return link.source == v.source && link.target == v.target

  })
  if (dupe) {
    console.log(chalk.red('Link already exists!'))
    return false
  }
  var maxid = getMaxId() + 1
  link.id = maxid
  links.push(link)
  settings.write('links', links)
  settings.write('maxid', maxid)
  console.log(chalk.green('Link created with id #' + link.id + ':'))
  console.log(linksDataUtils.stringify(link))
  console.log(chalk.yellow('(Make sure the link looks as you planned. Varify trailing slashes validity).'))
  return true
}

function get(id) {
  var links = settings.read('links') || []
  if (id) {
    links = links.filter(function(link) {
      return link.id == id
    })
    return links[0]
  } else {
    return getNextToSync(links)
  }
}

function removeById(id) {
  var links = settings.read('links') || []
  var trash = settings.read('trash') || []
  var originalLength = links.length
  links = links.filter(function(link) {
    if (link.id == id) {
      trash.push(link)
      return false
    }
    return true
  })
  var newLength = links.length
  if (originalLength == newLength) {
    return false
  }
  settings.write('links', links)
  settings.write('trash', trash)
  return true
}

function updateCompleteById(id) {
  var links = settings.read('links') || []
  links.forEach(function(link) {
    if (link.id == id) {
      var now = new Date()
      link.lastSynced = now.getTime()
    }
  })
  settings.write('links', links)
}

function emptyTrash() {
  settings.write('trash', [])
}

///////////////////////

module.exports = {
  currentDirectory: currentDirectory,
  all: all,
  add: add,
  get: get,
  removeById: removeById,
  updateCompleteById: updateCompleteById,
  emptyTrash: emptyTrash
}
