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

  Promise.all(project.available.compilers.map(id => project.compiler(id).enhanced.start()))
    .then((results) => {
      results.forEach(report => {
        cli.buildInfo(report)
      })
    })
    .catch(err => {
      cli.error(err)
    })
}
