require('./env')

const argv = require('minimist')(process.argv)
const fs = require('fs')
const paths = require('../project/paths')

require('config')

const app = (options) => {
  if (process.env.NODE_ENV === 'production') {
    return require('./dist/app').setup(options)
  } else if (process.env.NODE_ENV === 'development') {
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

let instance

// Start the server when called from the CLI
if (module === require.main) {
  if (checkDependencies()) {
    instance = app(argv)
    instance.start()
  } else {
    console.log('dependencies are not met')
  }
}
