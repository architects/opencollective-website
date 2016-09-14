import * as webpack from '../webpack'

export const info = {
  command: 'start',
  description: 'start the project server',
  example: 'start --port 9000',
  options: {
    '--env': 'manually set the environment',
    '--port': 'listen on port'
  }
}

export function execute (options = {}, context = {}) {
  const { project } = context
  const cli = project.cli
}

export function validate (options = {}, context = {}) {

}

export function help (options, context = {}) {
  const { project } = context
  const cli = project.cli
}
