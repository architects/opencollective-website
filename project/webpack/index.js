import webpack from 'webpack'
import mapValues from 'lodash/mapValues'
import Report from './report' // eslint-disable-line

import { builder as buildFrontendConfig } from '../config/webpack.config.frontend.babel'
import { builder as buildServerConfig } from '../config/webpack.config.server.babel'

/**
 * Creates a webpack compiler with the passed config(s).
 * Adds a promise based interface for running the compiler
 * and getting a results object that can be used to generate
 * feedback
 *
 */
export const compiler = (config, options = {}) => (
  enhance(
    webpack(config.getConfig ? config.getConfig() : config), options.compiler, options.compilation
  )
)

export const exportConfig = (platform, options) => (
  buildConfig(platform, options).toString()
)

export const getConfig = (platform, options = {}) => {
  const cfg = buildConfig(platform, options).getConfig()

  if (options.cache) {
    cfg.cache = options.cache
  }

  delete(cfg.options)

  return cfg
}

export const buildConfig = (platform, options = {}) => {
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

export const enhance = (compilerInstance, compilerHooks, compilationHooks) => {

  compilerInstance.start = (options = {}) => (
    new Promise((resolve, reject) => {
      compilerInstance.run((err, stats) => {
        if (err) {
          reject(err)
        } else {
          resolve({
            stats,
            report: new Report(stats, options),
            config: compilerInstance.options,
            outputPath: compilerInstance.outputPath
          })
        }
      })
    })
  )

  // Attach hooks to webpack events
  if (compilerHooks) {
    mapValues(compilerHooks, (plugin, fn) => compiler.plugin(plugin, fn))
  }

  // Attach hooks to webpack compilation specific events
  if (compilationHooks) {
    compiler.plugin('compilation', (compilation) => {
      mapValues(compilationHooks, (plugin, fn) => {
        compilation.plugin(plugin, fn)
      })
    })
  }

  return compilerInstance
}
