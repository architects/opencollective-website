require('./env')
require('babel-register')

const { name, version } = require('../package.json')
const paths = require('./paths')
const argv = require('minimist')(process.argv)
const camelCase = require('lodash/camelCase')
const mapKeys = require('lodash/mapKeys')
const omit = require('lodash/omit')

const projectInterface = {
  argv,
  cliOptions: mapKeys(omit(argv,'_'), (v,k) => camelCase(k)),
  command: argv._.slice(2).join(' '),
  config: require('config'),
  name,
  paths,
  version,
  get gitInfo() {
    return require('./git-info')(paths.project)
  },
  startRepl(...args) {
    require('./repl')(...args)
  }
}

module.exports = projectInterface

if (module === require.main) {
  require('./cli').start(projectInterface)
}
