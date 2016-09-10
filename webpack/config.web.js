const plugins = require('./plugins')
const compact = require('lodash/compact')

const {
  ASSETS_PATH,
  NODE_MODULES,
  OUTPUT_PATH,
  PROJECT_ROOT,
  SOURCE_PATH
} = require('paths')

const imageOptimizations = {
  progressive:true,
  optimizationLevel: 7,
  interlaced: false,
  pngquant:{
    quality: "65-90",
    speed: 4
  }
}

module.exports = function(environment, options) {
  options.env = environment

  const config = generateBase(options)

  switch (environment) {
    case 'development':
    default:
      return normalize(
        development(config, options)
      )
  }
}

function generateBase(options = {}) {
  return {
    context: PROJECT_ROOT,

    devtool: 'eval',

    target: 'web',

    cache: true,

    entry: {
      bundle: ['./frontend/src/index.web.js']
    },

    output: {
      path: OUTPUT_PATH,
      filename: '[name].js',
      // public path tells our assets which path they will be served from
      publicPath: options.publicPath || '/static/'
    },

    plugins: [
      new plugins.ProvidePlugin({
        Promise: 'bluebird',
        fetch: 'exports?self.fetch!whatwg-fetch'
      }),

      new plugins.CopyPlugin([{
        from: ASSETS_PATH
      }]),

      new plugins.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        '__SERVER__': false,
        '__BROWSER__': true
      })
    ],

    module: {
      exprContextRegExp: /$^/,
      exprContextCritical: false,

      loaders: [ {
        test: /\.(eot|svg|ttf|woff|woff2)$/,
        loader: 'file-loader'
      }, {
        test: /\.(jpg|png|gif)$/,
        loaders: [
          'file-loader',
          'image-webpack?}'
        ]
      }, {
        test: /\.json$/,
        loader: 'json'
      }, {
        test: /numbro\/numbro/,
        loader: 'imports?require=>false'
      }]
    },

    resolve: {
      alias: {
        'joi': 'joi-browser'
      },

      modules: [
        SOURCE_PATH,
        NODE_MODULES
      ],

      mainFields: [
        'jsnext:main',
        'main'
      ]
    }
  }
}

function development (config, options = {}) {
  addBabelLoader(config)
  addStyleLoader(config)

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

function addBabelLoader(config, options = {}) {
  config.module.loaders.unshift({
    test: /\.js$/,
    loader: 'babel',

    query: {
      babelrc: false,
      cacheDirectory: true,
      presets: ["es2015-webpack", "stage-0", "react", "react-hmre"],
      plugins: [
        "add-module-exports",
        "lodash"
      ]
    },

    exclude: [
      /node_modules/,
      /dist/
    ],

    include: [SOURCE_PATH]
  })
}

function addHotModuleReloading(config) {
  //config.output.publicPath = 'http://localhost:3000/static/'

  config.entry.bundle.unshift(
    'webpack-hot-middleware/client'
  )

  config.plugins.push(
    new plugins.HotModuleReplacementPlugin(),
    new plugins.NoErrorsPlugin(),
  )
}

function addManifestGenerator(config, filename) {
  config.plugins.push(
    new plugins.StatsWriterPlugin({
      filename,
      fields: [
        'assetsByChunkName',
        'hash',
        'version',
        'assets'
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

  config.plugins.push(new plugins.StatsWriterPlugin({
    // saves relative to the output path
    filename: 'stats.web.development.json',
    fields: fields || defaultFields
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
