const { join, resolve, relative } = require('path')
const get = require('lodash/get')
const pkg = require('./package.json')

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

const env = process.env

const settings = get(pkg, 'opencollective', {
  publicPath: '/static/',
  source: 'src',
  assets: 'src/assets',
  output: 'dist',
  client: 'frontend',
  server: 'server',
  tools: 'project',
  copy: 'copy'
})

const PROJECT_ROOT = join(__dirname)
const FRONTEND_ROOT = env.FRONTEND_ROOT || resolve(PROJECT_ROOT, settings.client)
const COPY_ROOT = env.COPY_ROOT || resolve(PROJECT_ROOT, settings.copy)
const SERVER_ROOT = env.SERVER_ROOT || resolve(PROJECT_ROOT, settings.server)

// Provides a cleaner way of referring to locations within the project
const paths = {
  cwd: process.cwd(),

  project: PROJECT_ROOT,

  tools: join(PROJECT_ROOT, settings.tools),

  config: env.NODE_CONFIG_DIR || join(SERVER_ROOT, 'config'),

  node_modules: join(PROJECT_ROOT, 'node_modules'),

  copy: {
    src: COPY_ROOT,

    // where the production javascript will be found
    output: join(COPY_ROOT, settings.output),

    distPath: (...args) => `./${relative(PROJECT_ROOT, join(paths.copy.output, ...args))}`,

    srcPath: (...args) => `./${relative(PROJECT_ROOT, join(paths.copy.src, ...args))}`
  },

  frontend: {
    // where our main code lives
    src: join(FRONTEND_ROOT, settings.source),

    // css, images, fonts, etc.
    assets: join(FRONTEND_ROOT, settings.assets),

    // where our files get stored by webpack
    output: join(FRONTEND_ROOT, settings.output),

    publicPath: settings.publicPath || '/',

    join: (...args) => join(FRONTEND_ROOT, ...args),

    srcPath: (...args) => `./${relative(PROJECT_ROOT, join(paths.frontend.src, ...args))}`,

    distPath: (...args) => `./${relative(PROJECT_ROOT, join(paths.frontend.output, ...args))}`
  },


  server: {
    src: join(SERVER_ROOT, settings.source),

    // where the production javascript will be found
    output: join(SERVER_ROOT, settings.output),

    publicPath: settings.publicPath,

    join: (...args) => join(SERVER_ROOT, ...args),

    srcPath: (...args) => `./${relative(PROJECT_ROOT, join(paths.server.src, ...args))}`
  },

  /**
   * HELPER METHODS
   *
   * Make it easier to use values from this object
   */
  join: (...args) => join(paths.cwd, ...args),
  resolve: (...args) => resolve(paths.cwd, ...args),
  relative: (...args) => relative(paths.cwd, ...args),

  get: (...args) => get(paths, ...args)
}

module.exports = {
  name: pkg.name,
  version: pkg.version,
  package: pkg,
  paths: paths,
  settings: settings,

  get sourcePaths() {
    return {
      copy: get(paths, 'copy.src'),
      frontend: get(paths, 'frontend.src'),
      server: get(paths, 'server.src')
    }
  },

  get distPaths() {
    return {
      copy: get(paths, 'copy.output'),
      frontend: get(paths, 'frontend.output'),
      server: get(paths, 'server.output')
    }
  }
}
