/**
 * Webpack Configuration: Target node / commonjs
 *
 * Outputs modules which expect to be run in node.js.  A main difference
 * between the node and browser target is that our module will be able to
 * use nodes / npm module resolution at runtime.  This is accomplished by
 * treating all of the modules in node_modules/ as webpack `externals`
 *
 * See: https://webpack.github.io/docs/library-and-externals.html
 */
const loaders = require('../loaders')
const project = require('../..').project
const externals = require('../plugins/contrib').ExternalNodeModules
const { EXPOSE_ENV } = require('./env')

const server = (...args) => project.paths.server.srcPath(...args)
const frontend = (...args) => project.paths.frontend.srcPath(...args)

const entries = {
  development: {
    server: [
      // combines into one entry point
      'webpack/hot/poll?1000',
      server('index.js')
    ],

    // combines into one entry point
    renderer: [
      'webpack/hot/poll?1000',
      server('global.js'),
      frontend('index.node')
    ]
  },
  production: {
    server: [
      server('index.js')
    ],
    renderer: [
      server('global.js'),
      frontend('index.node')
    ]
  }
}

export const builder = (options = {}) => {
  const cfg = require('@terse/webpack').api()

    .entry(options.entry || entries[project.env])

    // all relative paths will be relative to the context
    .context(project.get('paths.context', process.cwd()))

    .target('node')

    .output({
      path: project.get('paths.server.output') ,
      publicPath: project.get('paths.server.publicPath'),
      filename: '[name].js'
    })

    .externals(externals())
    .externals(project.paths.tools)

    /**
     * Source Map Support in node requires the source-map-support module
     */
    .sourcemap("source-map")
    .plugin("webpack.BannerPlugin", {
      banner: `require("source-map-support").install();`,
      raw: true
    })

    /**
     * COMMON LOADERS
     *
     * These files are treated the same for all environments
     */
    .loader('json', '.json')

    /**
     * This treats the frontend/src folder as if it were a node_modules folder
     * which allows you to write nicer require statements and not worry about
     * relative requires which make reorganizing stuff a pain
     */
    .modules(project.get('paths.server.src'))

    // Apply our environment specific configurations
    .when('development', development.bind(builder, options))
    .when('production', production.bind(builder, options))

    /**
     * Expose environment vars such as NODE_ENV as process.env.NODE_ENV in our build
     */
    .plugin('webpack.DefinePlugin', EXPOSE_ENV)

    /**
     * Define some variables automatically in our build
     */
    .plugin('webpack.DefinePlugin', stringify({
      __SERVER__: true,
      __BROWSER__: false,
      ...options.injectVariables || {}
    }))

    /**
     * Include polyfills for fetch and use bluebird for Promise
     */
    .plugin('webpack.ProvidePlugin', {
      Promise: 'bluebird'
    })


    // Fix a problem with numbro
    .loader('numbro', '.js', {
      test: /numbro\/numbro/,
      loader: 'imports?require=>false'
    })

  return cfg
}

const production = (options, builder, paths = project.paths.server) => (
  builder
    .loader('babel', '.js', loaders.scripts.babelLoader({
      exclude: [
        /node_modules/,
        project.paths.server.output
      ],
      include: [
        project.paths.server.src,
        project.paths.frontend.src,
        project.paths.tools
      ]
    }))
)

const development = (options, builder, paths = project.paths.server) => (
  builder
    .plugin('webpack.HotModuleReplacementPlugin')

    .loader('babel', '.js', loaders.scripts.babelHotLoader({
      exclude: [
        /node_modules/,
        project.paths.server.output
      ],
      include: [
        project.paths.server.src,
        project.paths.frontend.src,
        project.paths.tools
      ]
    }))
)


// This exports a function which is compatible with using webpacks CLI
export default (env) => {
  const config = builder({
    entry: entries[process.env.NODE_ENV]
  }).getConfig()

  config.eslint = {
    configFile: require.resolve('./eslint.js'),
    useEslintRc: false
  }

  return config
}

const stringify = (hash) => JSON.stringify(hash)
