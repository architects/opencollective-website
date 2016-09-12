import mapValues from 'lodash/mapValues'
import * as loaders from '../loaders'

const { babelLoader, babelHotLoader } = loaders.scripts

export const builder = require("@terse/webpack").api()

export default (options = {}, project) => {
  const paths = project.paths

  const cfg = builder
    .entry(options.entry)
    .context(paths.context)
    .target('web')
    .modules(paths.frontend.src)

    .alias('joi', 'joi-browser')
    
    .output({
      path: paths.frontend.output,
      publicPath: paths.frontend.publicPath,
      name: '[name].js'
    })

    .plugin('webpack.DefinePlugin', stringify({...options.defineVaiables, 'process.env.NODE_ENV': 'development'}))

    .plugin('webpack.ProvidePlugin', {
      Promise: 'bluebird',
      fetch: 'exports?self.fetch!whatwg-fetch'
    })

    .plugin('copy-webpack-plugin', {
      from: paths.frontend.assets
    })

    .loader('json', '.json')

    .loader('file', ['.eot','.svg','.ttf','.woff','.woff2'], {
      loader: 'file-loader',
      include:[
        paths.frontend.assets
      ]
    })

    .loader('images', ['.jpg','.png','.gif'], loaders.assets.imageLoader('development'))

    .loader('css', '.css', {
      loaders: ['css', 'postcss'],
      include: [
        paths.frontend.join('src', 'css')
      ],
      exclude:[
        paths.node_modules
      ]
    })

    // I believe this is fixed in a later version of numbro
    .loader('numbro', {
      test: /numbro\/numbro/,
      loader: 'imports?require=>false'
    })

    .when('development', development.bind(builder, {...options, paths}))
    .when('production', production.bind(builder, {...options, paths}))

  if (options)

  return cfg
}

const production = (options, builder) => (
  builder
    .loader('babel', '.js', babelLoader())
    .loader('css', '.css', {
      include: [
        options.paths.frontend.src
      ],
      exclude: [
        options.paths.node_modules
      ]
    })
)

const development = (options, builder) => (
  builder
    .plugin('webpack.HotModuleReplacementPlugin')
    .plugin('webpack.DefinePlugin', stringify({...options.defineVaiables, 'process.env.NODE_ENV': 'development'}))
    .loader('babel', '.js', babelHotLoader({
      sourcePaths: [
        options.paths.frontend.src
      ]
    }))
)

const stringify = (hash) => JSON.stringify(hash)
