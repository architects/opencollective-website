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
      // build the widget css
      widget: frontend.srcPath('css/widget.css'),

      // build the dom renderer for the website with $i18n available globally
      website: [
        `expose?window.$i18n!${frontend.srcPath('lib/i18n')}`,
        frontend.srcPath('index.web')
      ]
    }
  })

  .plugin('html-webpack-plugin', {
    template: frontend.srcPath('templates/200.html'),
    filename: '200.html',
    chunks: ['website']
  })

  /**
   * FIX PROBLEM MODULES
   *
   * joi has a separate browser build, we substitute require('joi') with that
   */
  .alias('joi', 'joi-browser')

  // Fix a problem with numbro
  .loader('numbro', '.js', {
    test: /numbro\/numbro/,
    loader: 'imports?require=>false'
  })

  // SEE https://github.com/moment/moment/issues/1435#issuecomment-232687733
  // prevents loading all the locales
  .plugin('webpack.IgnorePlugin', /^\.\/locale$/, /moment$/)

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
