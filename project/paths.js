const { join, resolve, relative } = require('path')

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

const env = process.env

const PROJECT_ROOT = join(__dirname, '..')
const FRONTEND_ROOT = env.FRONTEND_ROOT || resolve(PROJECT_ROOT, 'frontend')
const SERVER_ROOT = env.SERVER_ROOT || resolve(PROJECT_ROOT, 'server')

// Provides a more concise way of referring to within the project
const paths = {
  cwd: process.cwd(),

  project: PROJECT_ROOT,

  config: env.NODE_CONFIG_DIR || join(SERVER_ROOT, 'config'),

  frontend: {
    // where our main code lives
    src: join(FRONTEND_ROOT, 'src'),

    // css, images, fonts, etc.
    assets: join(FRONTEND_ROOT, 'src', 'assets'),

    // where our files get stored by webpack
    output: join(FRONTEND_ROOT, 'dist'),

    publicPath: '/static',

    join: (...args) => join(FRONTEND_ROOT, ...args),

    relative: (...args) => `./${relative(PROJECT_ROOT, join(paths.frontend.src, ...args))}`
  },

  server: {
    src: join(SERVER_ROOT, 'src'),

    // where the production javascript will be found
    output: join(SERVER_ROOT, 'dist'),

    publicPath: '/static',

    // the file which is built for server side rendering
    get renderer() {
      return join(paths.frontend.output, 'renderer.bundle.js')
    },

    join: (...args) => join(SERVER_ROOT, ...args),

    relative: (...args) => `./${relative(PROJECT_ROOT, join(paths.server.src, ...args))}`
  },

  createPath (...args) {
    return join(PROJECT_ROOT, ...args)
  },

  node_modules: join(PROJECT_ROOT, 'node_modules')
}

module.exports = paths
