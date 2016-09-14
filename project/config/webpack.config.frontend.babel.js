const project = require('..').project
const isEmpty = require('lodash/isEmpty')
const loaders = require('../webpack/loaders')
const plugins = require('../webpack/plugins')
const { EXPOSE_ENV } = require('./env')

export const builder = (options = {}) => {

  if (isEmpty(options.entry)) {
    project.cli.error(`Missing required option: ${'entry'.bold.red}`)
    throw new Error('Invalid options passed to builder')
  }

  const cfg = require('@terse/webpack').api()

    .entry(options.entry)

    .context(project.paths.context)

    .target('web')

    .output({
      path: project.paths.frontend.output,
      publicPath: '/static/',
      filename: '[name].js'
    })

    /**
     * COMMON LOADERS
     *
     * These files are treated the same for all environments
     */
    .loader('json', '.json')

    .loader('file', ['.eot','.svg','.ttf','.woff','.woff2'], {
      include: [ project.paths.frontend.assets ],
      exclude: [/node_modules/]
    })

    // Load vendor CSS from node_modules, no need to process with postcss
    .loader('css', '.css', {
      loader: ['style', 'css'],
      include: [
        project.paths.node_modules
      ]
    })

    /**
     * This treats the frontend/src folder as if it were a node_modules folder
     * which allows you to write nicer require statements and not worry about
     * relative requires which make reorganizing stuff a pain
     */
    .modules(project.paths.frontend.src)

    // Apply our environment specific configurations
    .when('development', development.bind(builder, options))
    .when('production', production.bind(builder, options))

    /**
     * Expose environment vars such as NODE_ENV as process.env.NODE_ENV in our build
     */
    .plugin('webpack.DefinePlugin', EXPOSE_ENV)

    /**
     * Copy our static assets to the build folder
     */
    .plugin('copy-webpack-plugin', [{
      from: project.paths.frontend.assets
    }])

    /**
     * Define some variables automatically in our build
     */
    .plugin('webpack.DefinePlugin', stringify({
      __SERVER__: false,
      __BROWSER__: true,
      ...options.injectVariables || {}
    }))

    /**
     * Include polyfills for fetch and use bluebird for Promise
     */
    .plugin('webpack.ProvidePlugin', {
      Promise: 'bluebird',
      fetch: 'exports?window.fetch!whatwg-fetch'
    })

  return cfg
}

const production = (options, builder, paths = project.paths.frontend) => {
  const { loader } = plugins.helpers.styleExtractor({name:'[name].css'})

  const prod = builder
    .loader('babel', '.js', loaders.scripts.babelLoader({
      include: [paths.src],
      exclude: [/node_modules/]
    }))

    .loader('extract-css', '.css', loaders.css.extractingLoader({
      loader,
      include: [paths.src],
      exclude: [/node_modules/]
    }))

    // Run our images through the image optimizing loaders
    .loader('images', ['.jpg','.png','.gif'], {
      include: [paths.assets],
      loader: loaders.assets.imageLoader('production', {
        progressive:true,
        optimizationLevel: 7,
        interlaced: false,
        pngquant:{
          quality: "65-90",
          speed: 4
        }
      })
    })

    return prod
}

const development = (options, builder, paths = project.paths.frontend) => {
  const dev = builder
    .plugin('webpack.HotModuleReplacementPlugin')

    .loader('babel', '.js', loaders.scripts.babelHotLoader({
      include: [paths.src],
      exclude: [/node_modules/]
    }))

    // This lets us require css in javascript, injecting them into our head as style tags
    .loader('css', '.css', {
      loaders: ['style', 'css', 'postcss'],
      include: [
        paths.join('src', 'css')
      ],
      exclude:[/node_modules/]
    })

    .loader('images', ['.jpg','.png','.gif'], {
      include: [paths.assets],
      loader: loaders.assets.imageLoader('development')
    })

  return dev
}


// This exports a function which is compatible with using webpacks CLI
export default (env) => {
  const config = builder({
    entries: entries[process.env.NODE_ENV]
  }).getConfig()

  config.postcss = require('./postcss')

  config.eslint = {
    configFile: require.resolve('./eslint.js'),
    useEslintRc: false
  }

  return config
}

const stringify = (hash) => JSON.stringify(hash)
