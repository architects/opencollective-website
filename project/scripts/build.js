import * as webpack from '../webpack'

export const info = {
  command: 'build <compiler>',
  description: 'compiles the project assets with webpack for a target platform',
  example: 'build <platform>',
  options: {
    '--env': 'manually set the environment'
  }
}

export function help (options, context = {}) {
  const { project } = context
  const cli = project.cli
}

export function execute (options = {}, context = {}) {
  const { project } = context
  const cli = project.cli

  const serverConfig = webpack.buildConfig('server', {
    entry: {
      server: project.paths.server.join('index.js')
    }
  })

  const cfg = serverConfig.getConfig()

  cfg.profile = true

  const compiler = webpack.compiler(cfg).enhanced

  compiler.start()
    .then((results) => {
      if (results.hasErrors) {
        cli.displayErrors('Failed to compile\n', results.errors)
      } else if (results.hasWarnings) {
        cli.displayErrors('Compiled with warnings\n', results.warnings)
      } else {
        cli.clear()

        cli.print()
        cli.success({
          type: 'title',
          name: 'DONE',
          message: `Compiled successfully in ${results.timeInMs} ms`
        })

        cli.print()
        cli.buildInfo(results)
        cli.print(`\n\n`)
      }
    })
    .catch((error) => {
      cli.error({
        type: 'title',
        name: 'FATAL',
        message: error
      })
    })

}
