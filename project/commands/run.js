import { inspect } from 'util'

export const info = {
  command: 'run <script>',
  description: 'will run any script with the project context available to it',
  example: 'run project/migrations/copy.js'
}

export function execute (options = {}, context = {}) {
  const { project } = context
  const cli = project.cli

  const vm = require('vm')
  const path = project.command.phrase.split(' ').slice(1).join('')
  const wrap = require('module').wrap

  const scriptPath = project.paths.join(`project/scripts/${path}`)
  const code = project.fsx.readFileSync(scriptPath.toString())

  const script = new vm.Script(code)

  const sandbox = {
    ...project.context,
    console: console,
    ...require('chai'),
    require,
    Promise: require('bluebird'),
    fetch: require('whatwg-fetch')
  }

  try {
    script.runInContext(vm.createContext(sandbox))
  } catch (error) {
    cli.error(error)
  }
}

export function help (options = {}, context = {}) {

}

export function validate (options = {}, context = {}) {

}
