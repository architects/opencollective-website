const colors = require('colors')
require('shelljs/global')

global._ = require('lodash')
global.get = _.get
global.defaults = _.defaults
global.join = require('path').join
global.ARGV = global.argv = require('minimist')(process.argv)

global.log = console.log.bind(console)
global.msg = (message, icon) => log(`${emoji(icon)}  ${message}`)

if (/^win/.test(process.platform)) {
  global.emoji = () => '-'
  global.banner = () => {
    log('***')
    log('OpenCollective')
    log('***')
    log()
  }
} else {
  global.emoji = (...args) => require('node-emoji').get(...args)

  global.banner = function() {
    MultiLineBanner()
  }
}

function MultiLineBanner() {
  console.log()
  console.log(
  colors.rainbow(
    require('figlet').textSync('            Open', {
      font: 'Graffiti'
    })
  ))

  console.log(
  colors.rainbow(
    require('figlet').textSync('Collective', {
      font: 'Graffiti'
    })
  ))
  console.log()
  console.log()
}
