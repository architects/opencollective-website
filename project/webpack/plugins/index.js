import core from './core'
import * as contrib from './contrib'
import mapValues from 'lodash/mapValues'

export const helpers = {
  core,
  contrib,

  assetManifest(options = {}) {
    return new contrib.AssetManifestPlugin({
      output: `${options.prefix}${options.name}-manifest.json`
    })
  },

  injectVars(object = {}) {
    return new core.DefinePlugin(mapValues(object, (v) => JSON.stringify(v)))
  },

  friendlyErrors(options = {}) {
    return new core.FriendlyErrorsPlugin(options)
  },

  provide(freeModules) {
    return new core.ProvidePlugin(freeModules)
  }
}

export default helpers
