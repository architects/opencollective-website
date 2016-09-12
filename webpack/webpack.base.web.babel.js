import defaults from 'lodash/defaults'
import plugins from './helpers/plugins'

const paths = require('../paths')
const resolvePaths = (...paths) => paths.map(require.resolve)

module.exports = (options = {}) => {
  defaults(options, {
    context: paths.project,
    sourcePath: paths.frontend.src,
    outputPath: paths.frontend.output,
    publicPath: paths.frontend.public,

    devtool: 'eval',

    environment: process.env.NODE_ENV,

    // See https://webpack.github.io/docs/configuration.html#resolve-alias
    moduleAliases: {},

    // Used to provide free modules that don't have to be required
    provideModules: {},

    // Used to inject anything that can be JSON serialized into the modules scope
    defineVariables: {},

    // Define additional loaders specific to the environment
    loaders: [],

    // Webpack accepts an array of plugins
    plugins: [],

    extensions: [ '.js', '.jsx', '.css', '']
  })

  return {
    target: 'web',

    context: options.context,

    entry: options.entry,

    output: {
      path: options.outputPath,
      filename: '[name].js',
      // use any passed in options
      ...options.output
    },

    plugins: [
      plugin.provide({
        Promise: 'bluebird',
        fetch: 'exports?self.fetch!whatwg-fetch',
        ...options.provideModules
      }),

      plugin.defineVariables({
        'process.env.NODE_ENV': options.environment
      })
    ],

    module: {
      exprContextRegExp: /$^/,
      exprContextCritical: false,

      loaders: [{
        test: /\.json$/,
        loader: 'json-loader'
      }]
    },

    resolve: {
      alias: {
        ...options.moduleAliases
      },
      extensions: options.extensions
    }
  }
}

function addStyleLoader(config, options = {}) {
  const cssNext = require('postcss-cssnext');
  const cssImport = require('postcss-import');
  const cssNested = require('postcss-nested');

  config.postcss = () => {
    return [
      cssNext,
      cssImport,
      cssNested
    ]
  }

  const styleExtract = new plugins.ExtractTextPlugin('[name].css')

  config.module.loaders.push({
    test: /\.css$/,
    loader: styleExtract.extract(['css','postcss']) ,
    exclude:[
      /node_modules/
    ]
  }, {
    test: /\.css$/,
    loader: 'style!css',
    include:[NODE_MODULES]
  })

  config.plugins.push( styleExtract )
}
