const mapValues = require('lodash/mapValues')
const webpack = require('webpack')

// Stats plugin generates metadata about the webpack build
const { StatsWriterPlugin} = require('webpack-stats-plugin')

// Copies assets from another location, hashing them if they changed
const CopyPlugin = require('copy-webpack-plugin')

// ExtractText allows webpack to require and output css as expected
const ExtractTextPlugin = require('extract-text-webpack-plugin')

// Utility for building a map of external modules for webpack to ignore
const ExternalNodeModules = require('webpack-node-externals')

// Utility for running beforeBuild / afterBuild shell commands
const WebpackShellPlugin = require('webpack-shell-plugin')

// Generates HTML Assets with Webpack asset info automatically embedded
const HtmlWebpackPlugin = require('html-webpack-plugin')

// Provides much nicer messaging
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')

// Can be used to generate static sites from a react router app
// const StaticSiteGeneratorPlugin = require('static-site-generator-webpack-plugin')

const WebpackAssetsManifest = require('./asset-manifest-plugin')

// See: https://github.com/webpack/docs/wiki/list-of-plugins
const {
  DefinePlugin,
  ProvidePlugin,
  NoErrorsPlugin,
  HotModuleReplacementPlugin,
  DllPlugin,
  DllReferencePlugin
} = webpack

const {
  CommonsChunkPlugin,
  DedupePlugin,
  UglifyJsPlugin
} = webpack.optimize

export const plugins = {
  DllPlugin,
  DllReferencePlugin,
  CopyPlugin,
  ExtractTextPlugin,
  ExternalNodeModules,
  StatsWriterPlugin,
  DefinePlugin,
  ProvidePlugin,
  NoErrorsPlugin,
  HotModuleReplacementPlugin,
  DedupePlugin,
  CommonsChunkPlugin,
  WebpackShellPlugin,
  HtmlWebpackPlugin,
  UglifyJsPlugin,
  FriendlyErrorsPlugin
}

export const helpers = {
  /**
  // require('component/HomePage/HomePage.js') === require('component/HomePage')
  //
  useFolderNamesAsIndex() {
    return new webpack.ResolverPlugin(
      new DirectoryNameIndexesPlugin()
    )
  },
  */

  assetManifest(config, options = {}) {
    return new WebpackAssetsManifest({
      output: config.name ? `${config.name}-manifest.json` : `${config.target}-manifest.json`
    })
  },

  injectVars(object = {}) {
    return new DefinePlugin(mapValues(object, (v) => JSON.stringify(v)))
  },

  friendlyErrors(options = {}) {
    return new FriendlyErrorsPlugin(options)
  },

  provide(freeModules) {
    return new ProvidePlugin(freeModules)
  }
}

export default {
  ...helpers,
  get plugins() {
     return plugins
  }
}

/**
  - https://www.npmjs.com/package/directory-named-webpack-plugin
  - https://www.npmjs.com/package/asset-map-webpack-plugin
  - https://www.npmjs.com/package/asset-module-webpack-plugin
  - https://www.npmjs.com/package/react-router-path-extractor-webpack-plugin
  - https://www.npmjs.com/package/handlebars-webpack-plugin
  - https://www.npmjs.com/package/stateful-react-container-webpack-plugin
  - https://www.npmjs.com/package/react-router-static-webpack-plugin
  - https://www.npmjs.com/package/git-sha-webpack-plugin
  - https://www.npmjs.com/package/helmet-webpack-plugin
  - https://www.npmjs.com/package/static-site-generator-webpack-plugin
  - https://www.npmjs.com/package/webpack-package-loaders-plugin
*/
