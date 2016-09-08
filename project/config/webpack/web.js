const join = require('path').join
const compact = require('lodash/compact')
const webpack = require('webpack')
const { DefinePlugin, EnvironmentPlugin } = webpack
const {StatsWriterPlugin} = require('webpack-stats-plugin')
const CopyPlugin = require('copy-webpack-plugin')

/**
 * @param {String} options.target - one of webpack's environment targets
 * @param {Array} options.exposeVars - a list of ENV vars webpack can safely expose
 */
module.exports = function buildConfig(environment = 'development', options = {}) {
  const config = {
    context: process.cwd(),

    entry: {
      bundle: [
        './app/index.web.js'
      ]
    },

    output: {
      path: options.outputPath || join(process.cwd(), 'build'),
      filename: '[name].js',
      libraryTarget: 'umd',
      // public path tells our assets which path they will be served from
      publicPath: options.publicPath || '/',
    },

    target: options.target || 'web',
    progress: true,
    stats: 'normal',

    // determines if a module should be bundled by webpack, or if the
    // environment will provide it externally (e.g. through window.whatever on the web, or npm on node)
    externals: [],

    plugins: [
      new CopyPlugin([{
        from: join(process.cwd(), 'app/assets'),
      }]),

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
      }, {
        test: /numbro\/numbro/,
        loader: 'imports?require=>false'
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
        'joi': 'joi-browser',
        // TEMP TO resolve error with normalizr
        'lodash/object/mapValues': 'lodash/mapValues',
        'lodash/lang/isObject': 'lodash/isObject',
        'lodash/lang/isEqual': 'lodash/isEqual',
        'history-provider': 'history/lib/createBrowserHistory',
        'app-routes': './app/routes.web.js',
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

  // HMR is enabled by default. Can be opted out of via CLI flag or env variable
  if (options.hot !== false && !process.env.DISABLE_HMR) {
    addHotModuleReloading(config)
  }

  // generate a manifest of the assets with their chunk names / hashes
  addManifestGenerator(config, 'web.development.manifest.json')

  // the stats plugin generates valuable metadata about our build
  addStatsPlugin(config)

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

function addHotModuleReloading(config) {
  config.output.publicPath = 'http://localhost:3000/'

  config.entry.bundle.unshift(
    'webpack-hot-middleware/client?path=http://localhost:3000/__webpack_hmr'
  )

  config.plugins.push(
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin()
  )
}

function addManifestGenerator(config, filename) {
  config.plugins.push(
    new StatsWriterPlugin({
      filename,
      fields: [
        'assetsByChunkName',
        'hash',
        'version',
        'assets',
      ]
    })
  )
}

function addStatsPlugin(config, fields) {
  const defaultFields = [
    'errors',
    'warnings',
    'version',
    'hash',
    'publicPath',
    'assetsByChunkName',
    'assets',
    'entrypoints',
    'chunks',
    'modules',
    'filteredModules',
    'children'
  ]

  config.plugins.push(new StatsWriterPlugin({
    // saves relative to the output path
    filename: '../project/stats/web.development.json',
    fields: fields || defaultFields,
  }))
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
