import { buildConfig, compiler } from '../webpack'
import {websiteViews} from '../webpack/loaders/templates'

export const info = {
  name: 'server',
  description: 'a webpack compiler that compiles our server'
}

export const create = (options = {}) => {
  const { paths } = options
  const { frontend, server } = paths

  const config = buildConfig('server', {
    entry: {
      server: server.srcPath('index'),
      store: [
        `expose?global.Routes!${frontend.srcPath('routes')}`,
        frontend.srcPath('store/node')
      ],
      client: [
        'babel-polyfill',
        frontend.srcPath('lib/client')
      ],
      errorTemplate: `handlebars!${server.srcPath('views/pages/error.hbs')}`,
      widgetTemplate: `handlebars!${server.srcPath('views/pages/widget.hbs')}`
    }
  })

  .output({
    filename: '[name].js'
  })

  .loader('handlebars', ['.hbs','.handlebars'], {
    ...websiteViews()
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
