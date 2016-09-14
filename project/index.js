require('babel-register')

const { name, version } = require('../package.json')
const paths = require('..').paths
const argv = require('minimist')(process.argv)
const camelCase = require('lodash/camelCase')
const mapKeys = require('lodash/mapKeys')
const omit = require('lodash/omit')
const omitBy = require('lodash/omitBy')
const result = require('lodash/result')
const get = require('lodash/get')


const project = {
  name,
  version,
  paths,

  env: process.env.NODE_ENV,

  get isCLI() {
    return require.main === module
  },

  get command() {
    const parts = argv._.slice(2)

    return {
      phrase: parts.join(' '),
      namespace: parts[0],
      action: parts[1] || parts[0],
      options: mapKeys(omit(argv,'_'), (v,k) => camelCase(k))
    }
  },

  get context() {
    return {
      project,
      env: process.env.NODE_ENV,
      command: project.command,
      lodash: require('lodash'),
      cli: project.cli
    }
  },

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
      },

      get scripts() {
        return Object.keys(require('./scripts'))
      }
    }
  },

  /**
   * Starts a console with the project as a local variable
   */
  console(options = {}, context = {}, onReady) {
    context.project = project
    context.fs = fsx

    require('./repl')(options, context, onReady)
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

  get fsx() {
    return require('./utils/fsx')
  }
}

const cli = require('./utils/pretty-cli').attach(project)

Object.defineProperty(project, 'cli', {
  enumerable: false,
  get: () => cli
})

module.exports = {
  project
}

if (require.main === module) {
  require('./cli').start(project)
}
