const resolvePaths = (...paths) => paths.map(require.resolve)
const webpack = require('webpack')

module.exports = {
  /**
   * Tell webpack where to start. The value for any entry can be a single
   * string, or an array of strings which will be combined. Paths here are
   * resolved relative to the context setting which defaults to this files __dirname
   */
  entry: {
    bundle: [
      './server/src/global',
      './frontend/src/index.node.js'
    ]
  },

  /**
   * Setting the target to node and telling webpack that
   * any require statements that resolve to an npm dependency
   * should not be bundled, and instead assume it can be required
   * like any other commonjs module.
   */
  target: 'node',
  externals: [
    externalNodeModules()
  ],

  output: {
    path: distPath,
    filename: 'server.[name].js',
    // outputs a module that can be required in node
    libraryTarget: 'commonjs',
    // TODO: may not be necessary here but to be consistent w/ the web build
    publicPath: '/static/'
  },

  cache: true,

  node: {
    console: true
  },

  plugins: [
    new ProvidePlugin({
      Promise: 'bluebird',
      fetch: 'exports?self.fetch!whatwg-fetch'
    }),

    new DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify(process.env.NODE_ENV || 'development'),
      '__SERVER__': true,
      '__BROWSER__': false,
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
      query: babelConfig()
      include: [
        sourcePath
      ],
      exclude: [
        /node_modules/,
        /dist/
      ],
    },{
      test: /\.json$/,
      loader: 'json'
    }],

    // Silences any warnings about dynamic require statements found in our dependencies.
    exprContextRegExp: /$^/,
    exprContextCritical: false,
  },

  resolve: {
    modules: [
      /*
        When attempting to resolve a non-relative require statement, attempt to use
        our sourcePath as if it were a node_modules folder. This allows you to write
        all require statements relative to sourcePath e.g. components/HomePage instead of
        having to use the ../../../relative-path all the time.
      */
      sourcePath,

      // use normal node module resolution behavior
      'node_modules'
    ],

    mainFields: [
      'jsnext:main',
      'main'
    ]
  }
}

const babelConfig = () => ({
  // Ignore the project's babelrc
  babelrc: false,

  // This is a setting for babel-loader only
  cacheDirectory: true,

  presets: resolvePaths([
    "babel-preset-es2015",
    "babel-preset-stage-0",
    "babel-preset-react"
  ]),

  plugins: resolvePaths([
    "babel-plugin-add-module-exports",
    "babel-plugin-lodash"
  ]),

  only: [
    sourcePath
  ]
})

