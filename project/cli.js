import mapValues from 'lodash/mapValues'
import {describe} from './utils/describe-component'

export function start(project, context = {}) {
  const cli = project.cli
  const scripts = require('./scripts')
  const available = Object.keys(scripts)

  cli.registerCommand('showHelp', (...args) => displayHelp(project, ...args))

  if (project.commandScope === '') {
    cli.banner()
    cli.showHelp()
  } else if (available.indexOf(project.commandScope) === -1) {
    cli.showHelp()
  } else {
    const script = scripts[project.commandScope]

    script.execute(project.argv, {
      ...context,
      project,
      env: project.env
    })
  }
}

const displayHelp = (project, options = {}) => {
  const cli = project.cli
  const scripts = require('./scripts')

  cli.print(`\n\n`)
  cli.print(`Available Commands`.underline.green, 2)
  cli.print(`\n`, 1)

  cli.paddedList(
    Object.keys(scripts).reduce((memo, key) => {
      const script = scripts[key]
      memo[script.info.command] = script.info.description
      return memo
    }, {})
  )

  cli.print('\n\n\n')
}
