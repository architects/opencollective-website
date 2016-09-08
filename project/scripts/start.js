import { runWebpackBuild } from './build'

export function command (commander) {
  commander
    .command(`start [platform]`)
    .description('start a hot reloading development server')
    .allowUnknownOption(true)
    .option('--env', 'specify the environment', process.env.NODE_ENV)
    .option('--port', 'which port to listen on', 3000)
    .option('--hostname', 'which hostname to listen on', '0.0.0.0')
    .option('--no-hot', 'disable hot module reloading')
    .option('--lint', 'enable inline linters')
    .action((platform = 'web', argv = {}) => {
      banner()
      log()
      msg('Starting the project server', 'sunny')

      try {
        rm(`${process.cwd()}/node_modules/redux-router/.babelrc`)
      } catch (e) {

      }

      if (argv.env === 'production') {
        require('child_process').spawnSync(
          'node', ['server'], {
            terminal: true,
            colors: true,
            stdio: 'inherit'
          }
        )
      } else {
        msg('Generating SSR Build', '100')
        runWebpackBuild('node', argv.env)
          .then(() => {
            msg('Starting dev server', 'sunny')
            startDevServer(argv)
          })
      }
    })
}

function startDevServer(options = {}) {
  const app = require('../../server').create({
    ...options,
    dev: true,
  })

  app.start()
}
