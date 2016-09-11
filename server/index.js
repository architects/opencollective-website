const argv = require('minimist')
const fs = require('fs')
const path = require('path')

process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || path.join(__dirname, 'config')
require('config')

const paths = require('../webpack/paths')

const app = (options) => {
  if (process.env.NODE_ENV === 'production') {
    return require('./dist/app').setup(options)
  } else {
    require('babel-register')
    return require('./src/app').setup(options)
  }
}

const checkDependencies = () => {
  const exists = fs.exitsSync

  if (!exists(paths.server.renderer)) {
    throw ('The Server Rendering Bundle does not exist')
  }
}

const instance = module.exports = app(argv)

// Start the server when called from the CLI
if (module === require.main) {
  if (checkDependencies()) {
    instance.start()
  } else {
    console.log('dependencies are not met')
  }
}
