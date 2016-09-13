import webpack from 'webpack'
import mapValues from 'lodash/mapValues'

import { builder as buildFrontendConfig } from './config/webpack.config.frontend.babel'
import { builder as buildServerConfig } from './config/webpack.config.server.babel'

const __cache = {}

export function compiler(config, options = {}) {
  const base = webpack(config)

  Object.assign(base, {
    get enhanced() {
      return enhance(base, options.compiler, options.compilation)
    }
  })

  return base
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

function enhance (compilerInstance, compilerHooks, compilationHooks) {
  if (compilerHooks) {
    mapValues(compilerHooks, (plugin, fn) => compiler.plugin(plugin, fn))
  }

  if (compilationHooks) {
    compiler.plugin('compilation', (compilation) => {
      mapValues(compilationHooks, (plugin, fn) => {
        compilation.plugin(plugin, fn)
      })
    })
  }

  compilerInstance.start = (options = {}) => (
    new Promise((resolve, reject) => {
      compilerInstance.run((err, stats) => {
        if (err) {
          reject(err)
        } else {
          resolve(createResult(stats))
        }
      })
    })
  )

  return compilerInstance
}

function createResult(stats, options = {}) {
  const json = stats.toJson(options)

  return {
    get hasErrors() {
      return stats.hasErrors()
    },
    get hasWarnings() {
      return stats.hasWarnings()
    },
    get json() {
      return json
    },
    get timeInMs() {
      return ((stats.endTime-stats.startTime)/ 1000).toFixed(2)
    },
    get hash() {
      return stats.hash
    },
    getStats() {
      return stats
    },
    get report() {
      return stats.toString(options)
    }
  }
}
