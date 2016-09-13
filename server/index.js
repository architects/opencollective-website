const mapKeys = require('lodash/mapKeys')
const camelCase = require('lodash/camelCase')
const omit = require('lodash/omit')
const argv = mapKeys(omit(require('minimist')(process.argv),'_'), (v,k) => camelCase(k))
const pkg = require('..')
const paths = pkg.paths

process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
  require('babel-register')
  process.env.NODE_CONFIG_DIR = paths.config
}

console.log(
  JSON.stringify(pkg, null, 2)
)

const app = process.env.NODE_ENV === 'production'
  ? require(paths.server.join('dist/index.js'))
  : require(paths.server.join('src/index.js'))

app.setup(  )

if (require.main === module) {
  app.start()
}
