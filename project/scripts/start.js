import * as webpack from '../webpack'

export const info = {
  command: 'start',
  description: 'start the project server',
  example: 'server <platform>',
  options: {
    '--env': 'manually set the environment'
  }
}

export function execute (options = {}, context = {}) {
  const { project } = context
  const cli = project.cli
  const configurations = {}

  configurations['express-server'] = webpack.buildConfig('server', {
    entry: {
      server: [
        'webpack/hot/poll?1000',
        project.paths.server.relative('app.js')
      ]
    },
    renderer: [
        'webpack/hot/poll?1000',
        project.paths.frontend.relative('index.node.js')
    ]
  })

  const compiler = webpack.compiler(configs).enhanced

  compiler.start()
    .then((results) => {

    })
    .catch((error) => {
      cli.error('Build error...')
    })

}

export function validate (options = {}, context = {}) {

}

export function help (options, context = {}) {
  const { project } = context
  const cli = project.cli
}
