const { join, relative } = require('path')
const env = process.env
const project = join(__dirname, '..')
const frontend = env.FRONTEND_ROOT || join(project, 'frontend')
const server = env.SERVER_ROOT || join(project, 'server')
const bundleFile = env.BUNDLE_FILE || 'server.bundle.js'

// Provides a more concise way of referring to paths
const paths = {
  cwd: process.cwd(),

  project: project,

  config: env.NODE_CONFIG_DIR || join(server, 'config'),

  frontend: {
    // where our main code lives
    src: join(frontend, 'src'),

    // css, images, fonts, etc.
    assets: join(frontend, 'src', 'assets'),

    // where our files get stored by webpack
    output: join(frontend, 'dist'),

    join: (...args) => join(frontend, ...args),

    relative: (...args) => `./${relative(project, join(paths.frontend.src, ...args))}`,
  },

  server: {
    src: join(server, 'src'),

    // where the production javascript will be found
    output: join(server, 'dist'),

    // the file which is built for server side rendering
    renderer: join(frontend, 'dist', bundleFile),

    join: (...args) => join(server, ...args),

    relative: (...args) => `./${relative(project, join(paths.server.src, ...args))}`,
  },

  createPath (...args) {
    return join(project, ...args)
  },

  node_modules: join(project, 'node_modules'),
}

// Export the import paths in a CONSTANT style
module.exports = Object.assign(paths, {
  SOURCE_PATH: paths.frontend.src,
  OUTPUT_PATH: paths.frontend.output,
  ASSETS_PATH: paths.frontend.assets,
  PROJECT_ROOT: paths.project,
  SSR_BUNDLE: paths.server.renderer,
})
