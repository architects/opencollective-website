import { buildConfig, compiler } from '../webpack'

export const info = {
  name: 'server',
  description: 'a webpack compiler that compiles our server'
}

export const create = (options = {}) => {
  const { paths } = options
  const { frontend, server } = paths

  const config = buildConfig('server', {
    entry: {
      index: server.srcPath('index'),
      client: [
        'babel-polyfill',
        frontend.srcPath('lib/client')
      ]
    }
  })

  .output({
    filename: '[name].js'
  })

  .plugin('webpack.ProvidePlugin', {
    fetch: 'exports?global.fetch!whatwg-fetch',
    localStorage: 'localmockage'
  })

  config.plugins && config.plugins.push( ...(options.plugins || []) )

  .getConfig()

  // Disable a needless warning
  config.module = {
    ...config.module,
    exprContextRegExp: /$^/,
    exprContextCritical: false
  }

  return compiler({
    name: 'server',
    ...config
  })
}
