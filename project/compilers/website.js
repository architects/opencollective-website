import { buildConfig, compiler } from '../webpack'
import postcss from '../config/postcss'
import eslint from '../config/eslint'
import plugins from '../webpack/plugins/core'

export const info = {
  name: 'website',
  description: 'compiles the website assets for our frontend'
}

export const create = (options = {}) => {
  const { frontend } = options.paths

  const config = buildConfig('web', {
    entry: {
      website: frontend.srcPath('index.web'),
      widget: frontend.srcPath('css/widget.css')
    }
  })

  .plugin('html-webpack-plugin', {
    template: frontend.srcPath('templates/200.html'),
    filename: '200.html',
    chunks: ['website']
  })

  .getConfig()

  // HACK
  if (process.env.NODE_ENV === 'production') {
    config.plugins.push( new plugins.ExtractTextPlugin('[name].css') )
  }

  return compiler({
    name: options.name,
    ...config,
    cache: options.cache,
    postcss,
    eslint
  })
}
