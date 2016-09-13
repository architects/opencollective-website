export const info = {
  command: 'console',
  description: 'starts a console inside the server side app context',
  example: 'console'
}

export function execute (options = {}, context = {}) {
  const { project } = context
  const cli = project.cli

  cli.banner()

  require('../repl')({}, {
    project,

    store() {
      return require('../../frontend/src/store/node')
    },

    webpack() {
      return require('../webpack')
    },

    compilers() {
      return require('../compilers')
    },

    renderer() {
      return require('../../frontend/src/index.node')
    }
  })
}

export function help (options = {}, context = {}) {

}

export function validate (options = {}, context = {}) {

}
