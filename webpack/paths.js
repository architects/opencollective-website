const path = require('path')
const { join } = path

const env = process.env
const project = join(__dirname, '..')
const frontend = env.FRONTEND_ROOT || join(project, 'frontend')
const server = env.SERVER_ROOT || join(project, 'server')

const paths = {
  cwd: process.cwd(),

  project: project,

  config: env.NODE_CONFIG_DIR || join(server, 'config'),

  frontend: {
    src: join(frontend, 'src'),
    assets: join(frontend, 'src', 'assets'),
    output: join(frontend, 'dist')
  },

  server: {
    src: join(server, 'src'),
    output: join(server, 'dist'),
  },

  createPath (...args) {
    return join(project, ...args)
  },

  node_modules: join(project, 'node_modules'),
}

module.exports = Object.assign(paths, {
  SOURCE_PATH: paths.frontend.src,
  OUTPUT_PATH: paths.frontend.output,
  ASSETS_PATH: paths.frontend.assets,
  PROJECT_ROOT: paths.project,
})


