import defaults from 'lodash/defaults'
import plugins from './helpers/plugins'

const paths = require('../paths')
const resolvePaths = (...paths) => paths.map(require.resolve)

module.exports = (options = {}) => {
  defaults(options, {
    sourcePath: paths.server.src,
    outputPath: paths.server.output,

    // Used to provide free modules that don't have to be required
    provideModules: {},

    // Used to inject anything that can be JSON serialized into the modules scope
    defineVariables: {},

    // Define additional loaders specific to the environment
    loaders: [],

    // Webpack accepts an array of plugins
    plugins: []
  })

  return {
    entry: options.entry,

    output: {
      path: options.outputPath,
      filename: 'server.[name].js',
      // use any passed in options
      ...options.output,
      // this is important
      libraryTarget: 'commonjs'
    },


    /**
     * Setting the target to node and telling webpack that
     * any require statements that resolve to an npm dependency
     * should not be bundled, and instead assume it can be required
     * like any other commonjs module.
     */
    target: 'node',

    /**
     * In a node environment we want to let node handle loading modules
     * so this will ensure that webpack doesn't bundle dependencies for us
    */
    externals: [
      plugins.ExternalNodeModules()
    ],

    node: {
      console: true,
      __dirname: true,
      __filename: true
    },

    plugins: [
      new plugins.ProvidePlugin({
        Promise: 'bluebird',
        fetch: 'exports?self.fetch!whatwg-fetch',
        ...(options.provideModules)
      }),

      new plugins.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
        '__SERVER__': true,
        '__BROWSER__': false,
        '__DEV__': !process.env.NODE_ENV === 'production',
        '__PROD__': process.env.NODE_ENV === 'production',
        ...(options.defineVariables)
      })
    ],

    module: {
      /**
       * Our loader setup is currently simple, but when we begin to take advantage
       * of the webpack require ability for all types of files, we will need to take
       * steps to ensure irrelevant requires like css / images are handled differently.
      */
      loaders: [{
        test: /\.js$/,

        loader: 'babel',
        query: babelConfig(options),

        include: [
          options.sourcePath
        ],

        exclude: [
          /node_modules/,
          /dist/
        ]
       },{
        test: /\.json$/,
        loader: 'json'
      }].concat(options.loaders),

      // Silences any warnings about dynamic require statements found in our dependencies.
      exprContextRegExp: /$^/,
      exprContextCritical: false
    },

    resolve: {
      mainFields: [
        'jsnext:main',
        'main'
      ],

      modules: [
        /*
          When attempting to resolve a non-relative require statement, attempt to use
          our sourcePath as if it were a node_modules folder. This allows you to write
          all require statements relative to sourcePath e.g. components/HomePage instead of
          having to use the ../../../relative-path all the time.
        */
        options.sourcePath,

        // use normal node module resolution behavior
        'node_modules'
      ].concat(options.moduleFolders)
    }
  }
  
}
