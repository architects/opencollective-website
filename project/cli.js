import mapValues from 'lodash/mapValues'
import isFunction from 'lodash/isFunction'
import result from 'lodash/result'
import defaults from 'lodash/defaults'
import attempt from 'lodash/attempt'
import isError from 'lodash/isError'
import get from 'lodash/get'
const commands = require('./commands')

import {describe} from './utils/describe-component'

export function start(project, context = {}) {
  const cli = project.cli
  const available = Object.keys(commands)

  cli.registerCommand('showHelp', (...args) => displayHelp(project, ...args))

  if (project.command.namespace === '') {
    cli.banner()
    cli.showHelp()
  } else if (available.indexOf(project.command.namespace) === -1) {
    cli.showHelp()
  } else {
    const command = findCommand(project.command)

    // the first argument to any command
    const params = defaults({}, project.command.options, result(command, 'defaults'))

    // the 2nd argument to any command
    const ctx = { ...context, project, env: project.env, command: project.command }

    command.execute(params, ctx)
  }
}

const displayHelp = (project, options = {}) => {
  const cli = project.cli
  const commands = require('./commands')

  cli.print(`\n\n`)
  cli.print(`Available Commands`.underline.green, 2)
  cli.print(`\n`, 1)

  cli.paddedList(
    Object.keys(commands).reduce((memo, key) => {
      const command = commands[key]
      memo[command.info.command] = command.info.decommandion
      return memo
    }, {})
  )

  cli.print('\n\n\n')
}

const findCommand = (command) => {
  const result = commands[command.namespace]

  if (!isFunction(result.execute)) {
    throw 'Invalid command: must export an execute method and an info property'
  }

  return {
    execute: result.execute,
    validate: get(result, 'validate', () => true),
    help: get(result, 'help', (params, context) => {
      context.project.cli.print(`\n\n${command.phrase} does not have any help.`)
    })
  }
}
