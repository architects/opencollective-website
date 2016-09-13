require('./env')
require('babel-register')

const { name, version } = require('../package.json')
const paths = require('./paths')
const argv = require('minimist')(process.argv)
const camelCase = require('lodash/camelCase')
const mapKeys = require('lodash/mapKeys')
const omit = require('lodash/omit')
const result = require('lodash/result')
const get = require('lodash/get')

const project = {
  argv: mapKeys(omit(argv,'_'), (v,k) => camelCase(k)),
  command: argv._.slice(2).join(' '),
  get commandScope() {
    return project.command.split(' ')[0]
  },
  config: require('config'),
  name,
  paths,
  version,
  env: process.env.NODE_ENV,
  get gitInfo() {
    return require('./git-info')(paths.project)
  },

  get available() {
    return {
      get compilers() {
        return Object.keys(require('./compilers'))
      },

      get commands() {
        return Object.keys(require('./scripts'))
      }
    }
  },

  getCompiler(name) {
    return require('./compilers')[name]
  },

  compiler(name, options = {}) {
    options.name = name
    options.paths = project.paths
    
    return this.getCompiler(name).create(options)
  },

  get(key, defaultVal) {
    return get(project, key, defaultVal)
  },

  result(key, defaultVal) {
    return result(project, key, defaultVal)
  },

  startRepl(...args) {
    require('./repl')(...args)
  }
}

project.cli = require('./utils/pretty-cli').attach(project)

module.exports = {
  project
}

if (require.main === module) {
  require('./cli').start(project)
}
