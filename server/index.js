const mapKeys = require('lodash/mapKeys')
const camelCase = require('lodash/camelCase')
const omit = require('lodash/omit')
const argv = mapKeys(omit(require('minimist')(process.argv),'_'), (v,k) => camelCase(k))
const pkg = require('..')
const paths = pkg.paths

process.env.NODE_CONFIG_DIR = `${__dirname}/config`

process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development'

let app

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
  require('babel-register')

  const setup = require('./src').setup

  app = setup({
    paths,
    version: pkg.version,
    devMiddleware: require('../project/webpack/middleware')
  })

} else {
  const setup = require('./dist').setup

  app = setup({
    paths,
    version: pkg.version
  })
}

app.start()
  .then(() => console.log('Server started'))
  .catch((error) => console.error('Error', error.message))
