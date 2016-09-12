import webpack from 'webpack'
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'
import plugin from './helpers/plugins'
import get from 'lodash/get'
import omit from 'lodash/omit'
import paths from '../paths'

export function compiler(options = {}, callback) {
  const prepared = prepare(options)
  const configurations = Object.values(prepared).map(config => omit(config, options.remove || []))

  return webpack(configurations, (err, stats) => {
    if (typeof callback === 'function') {
      callback(err, stats)
    } else {
      if (err) {
        console.error('FATAL ERROR IN WEBPACK COMPILATION'.red)
        console.log()
        console.log(err.message)
      } else {
        console.log(stats.toString({colors: true}))
      }
    }
  })
}

export default compiler

export function prepare(options = {}) {
  const profiles = options.profiles || ['client']
  const environment = get(options, 'env', process.env.NODE_ENV || 'development')
  const source = allProfiles[environment]

  const prepared = mapValues(
    pick(source, profiles),

    (config) => ({
      ...config,

      plugins: [
        ...config.plugins || [],
        plugin.assetManifest(config),
        plugin.friendlyErrors(config)
      ]
    })
  )

  return prepared

}

export const allProfiles = {
  dependencies: {
    client: clientDependencies,
    server: serverDependencies
  },

  development: {
    client: clientDevelopment,
    server: serverDevelopment,
    renderer: rendererDevelopment
  },

  production: {
    client: clientProduction,
    server: serverProduction,
    renderer: rendererProduction
  }
}

export function clientDevelopment(options = {}) {
  const env = require('./webpack.development.web.babel')

  return baseWebConfig({
    ...env,
    ...options,
    name: 'client-development'
  })
}

export function clientProduction(options = {}) {
  const env = require('./webpack.production.web.babel')

  return baseWebConfig({
    ...env,
    ...options,
    name: 'client-production'
  })
}

export function rendererDevelopment(options = {}) {
  const env = require('./webpack.development.node.babel')

  return baseNodeConfig({
    ...env,
    ...options,
    name: 'renderer-development'
  })
}

export function rendererProduction(options = {}) {
  const env = require('./webpack.production.node.babel')

  return baseNodeConfig({
    ...env,
    ...options,
    name: 'renderer-production'
  })
}


export function serverDevelopment(options = {}) {
  const env = require('./webpack.development.node.babel')

  return baseNodeConfig({
    ...env,
    ...options,
    name: 'server-development'
  })
}

export function serverProduction(options = {}) {
  const env = require('./webpack.production.node.babel')

  return baseNodeConfig({
    ...env,
    ...options,
    name: 'server-production'
  })
}


// Used to generate a DLL Bundle for the client side code
export function clientDependencies(options = {}) { }

// Used to generate a DLL Bundle for the server side code
export function serverDependencies(options = {}) { }
