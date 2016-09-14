import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'
import result from 'lodash/result'
import defaults from 'lodash/defaults'
import attempt from 'lodash/attempt'
import isError from 'lodash/isError'
import get from 'lodash/get'
const scripts = require('./scripts')

import {describe} from './utils/describe-component'


export function start(project, context = {}) {
  const cli = project.cli
  const available = Object.keys(scripts)

  cli.registerCommand('showHelp', (...args) => displayHelp(project, ...args))

  if (project.command.namespace === '') {
    cli.banner()
    cli.showHelp()
  } else if (available.indexOf(project.command.namespace) === -1) {
    cli.showHelp()
  } else {
    const script = findScript(project.command)

    // the first argument to any script
    const params = defaults({}, project.command.options, result(script, 'defaults'))

    // the 2nd argument to any script
    const ctx = { ...context, project, env: project.env, command: project.command }

    script.execute(params, ctx)
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

const findScript = (command) => {
  const script = scripts[command.namespace]

  if (!isFunction(script.execute)) {
    throw 'Invalid script: must export an execute method and an info property'
  }

  return {
    execute: script.execute,
    validate: get(script, 'validate', () => true),
    help: get(script, 'help', (params, context) => {
      context.project.cli.print(`\n\n${command.phrase} does not have any help.`)
    })
  }
}
