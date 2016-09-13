import webpack from 'webpack'
import plugins from './plugins/core'
import { builder as buildFrontendConfig } from './config/webpack.config.frontend.babel'
import { builder as buildServerConfig } from './config/webpack.config.server.babel'

const project = require('../index').project

const frontend = project.paths.frontend
const server = project.paths.server

const __cache = {}

export const compilers = {
  get website() {
    const config = {
      ...getConfig('web'),
      entry: {
        website: [
          frontend.relative('index.web')
        ]
      }
    }

    return compiler(config)
  },

  get renderers() {
    const config = getConfig('server', {
      entry: {
        website: [
          frontend.relative('index.node')
        ],
        server: server.relative('index.js')
      }
    })

    return compiler(config)
  },

  /**
   * WIP:
   *
   * Want the ability to build stylesheets separately for debugging SSR flash
   */
  get stylesheets() {

  }
}

export function compiler(config, ...args) {
  const base = webpack(config)

  Object.assign(base, {
    get enhanced() {
      return enhance(base)
    }
  })

  return base.enhanced
}

export function exportConfig(platform, options) {
  return buildConfig(platform, options).toString()
}

export function getConfig(platform, options) {
  const cfg = buildConfig(platform, options).getConfig()
  console.log('Config', cfg)
  cfg.cache = __cache

    delete(cfg.options)
  return cfg
}

export function buildConfig(platform, options = {}) {
  switch (platform) {
    case 'server':
    case 'node':
    case 'backend':
      return buildServerConfig(options)
    case 'frontend':
    case 'web':
    default:
      return buildFrontendConfig(options)
  }
}

function enhance (compilerInstance) {
  compilerInstance.start = (options = {}) => (
    new Promise((resolve, reject) => {
      compilerInstance.run((err, stats) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            get hasErrors() {
              return stats.hasErrors()
            },
            get hasWarnings() {
              return stats.hasWarnings()
            },
            get json() {
              return stats.toJson(options.stats)
            },
            get timeInMs() {
              return ((stats.endTime-stats.startTime)/ 1000).toFixed(2)
            },
            get hash() {
              return stats.hash
            },
            get getStats() {
              return stats
            },
            get report() {
              return stats.toString({ colors: options.colors !== false, ...(options.stats || {}) })
            }
          })
        }
      })
    })
  )

  return compilerInstance
}
