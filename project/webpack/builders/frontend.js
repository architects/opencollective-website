import mapValues = require('lodash/mapValues')

export const builder = require("@terse/webpack").api()

const pathsConfig = require('../../paths')

const paths = {
  frontend: pathsConfig.frontend,
  node_modules: pathsConfig.node_modules
}

const configs = {
  babel: {
    development: require('../config/babel.development'),
    production: require('../config/babel.production')
  }
}

export default (options = {}) => {
  builder
    .target('web')
    .context(pathsConfig.context)
    .output({
      path: paths.frontend.output,
      publicPath: paths.frontend.public,
      name: '[name].js'
    })
    .modules(paths.frontend.src)
    .loader('json', '.json')
    .when('development', development.bind(builder, options))
    .when('production', production.bind(builder, options))
}

const production = (options, builder) => (
  builder
    .loader('babel', '.js', {
      query: configs.babel.production(),
      include: [
        paths.frontend.src
      ],
      exclude: [
        /node_modules/
      ]
    })
    .loader('css', '.css', {

      include: [
        paths.frontend.src,
      ],
      exclude: [
        paths.node_modules
      ]
    })
)

const development = (options, builder) => (
  builder
    .plugin('webpack.HotModuleReplacementPlugin')
    .plugin('webpack.DefinePlugin', mapValues(options.defineVariables, (value) => (
      JSON.stringify(value)
    )))
    .loader('babel', '.js', {
      query: configs.babel.development({
        hot: true
      }),
      include: [
        paths.frontend.src
      ],
      exclude: [
        /node_modules/
      ]
    })
)
