const join = require('path').join
const compact = require('lodash/compact')
const webpack = require('webpack')
const { LimitChunkCountPlugin, EnvironmentPlugin } = webpack
const {StatsWriterPlugin} = require('webpack-stats-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const externalNodeModules = require('webpack-node-externals')

/**
 * @param {String} options.target - one of webpack's environment targets
 * @param {Array} options.exposeVars - a list of ENV vars webpack can safely expose
 */
module.exports = function buildConfig(environment = 'development', options = {}) {
  const config = {
    context: process.cwd(),

    entry: {
      app: [
        './app/index.node.js'
      ]
    },

    output: {
      path: options.outputPath || join(process.cwd(), 'build'),
      filename: '[name].js',
      libraryTarget: 'commonjs',
      // public path tells our assets which path they will be served from
      publicPath: options.publicPath || '/',
    },

    target: 'node',

    // determines if a module should be bundled by webpack, or if the
    // environment will provide it externally (e.g. through window.whatever on the web, or npm on node)
    externals: [
      externalNodeModules()
    ],

    plugins: [
      exposeEnvironmentVarsPlugin([
        'NODE_ENV',
        ...(options.exposeVars || []),
      ])
    ],

    module: {
      exprContextRegExp: /$^/,
      exprContextCritical: false,

      loaders: [{
        test: /\.json$/,
        loader: 'json'
      }],
      preLoaders: []
    },

    resolveLoader: {
      modules: [
        // current project's node modules
        join(process.cwd(), 'node_modules'),
        // look for any loaders in the project/node_modules
        join(__dirname, '../../node_modules'),
        // look for custom loaders in this folder
        join(__dirname, 'loaders')
      ]
    },

    resolve: {
      alias: {
        // TEMP TO resolve error with normalizr
        'lodash/object/mapValues': 'lodash/mapValues',
        'lodash/lang/isObject': 'lodash/isObject',
        'lodash/lang/isEqual': 'lodash/isEqual',
      },

      // modifies the paths we use to satisfy require statements
      modules: [
        // maps require('components/foo') to require('./app/components/foo')
        join(process.cwd(), 'app'),

        // normal commonjs behavior e.g. require('react')
        join(process.cwd(), 'node_modules'),

        // normal commonjs modules from the project folder (webpack-dev-middleware etc)
        join(__dirname, '../../node_modules')
      ],

      // when requiring a module, which package.json fields should webpack use for the main script
      mainFields: [
        'jsnext:main',
        'main'
      ]
    }
  }

  switch (environment) {
    case 'development':
    default:
      return normalize(
        development(config, options)
      )
  }
}

function development (config, options = {}) {
  addBabelLoader(config)
  return config
}

function addBabelLoader(config, options = {}) {
  const sourceFolders = options.sourceFolders || ['app','src']
  const babelConfig = require('../babel.development')

  config.module.loaders.unshift({
    loader: 'babel',
    query: {
      ...babelConfig,
      only: sourceFolders,
      presets: ['opencollective'],
    },
    test: /\.(js|jsx|es6)/,
    exclude: [
      /node_modules/,
    ],
    include: [
      ...sourceFolders.map(name => join(config.context, name))
    ]
  })
}

function normalize (custom = {}) {
  custom.plugins = compact(custom.plugins || [])

  if (custom.module && custom.module.loaders) {
    custom.module.loaders = compact(custom.module.loaders)
  }

  if (custom.module && custom.module.preLoaders) {
    custom.module.preLoaders = compact(custom.module.preLoaders)
  }

  return custom
}

function exposeEnvironmentVarsPlugin(variableNames) {
    return new EnvironmentPlugin([
      'NODE_ENV',
      ...variableNames,
    ])
}
