import * as webpack from '../webpack'

export const info = {
  command: 'build <compiler>',
  description: 'compiles the project assets with webpack for a target platform',
  example: 'build <platform>',
  options: {
    '--env': 'manually set the environment'
  }
}

export function execute (options = {}, context = {}) {
  const { project, command } = context
  const cli = project.cli
  const platform = command.action

  if (validate(options, context)) {
    const compilers = platform === 'all'
      ? project.available.compilers.map(id => project.compiler())
      : [project.compiler(platform, {compiler: compilerHooks, compilation: compilationHooks})]

    //cli.clear()
    cli.print(`Beginning build process for ${platform.bold}`, 2)
    cli.print()

    Promise.all(compilers.map(c => c.start()))
      .then((results) => {
        cli.print(`Compiler finished: ${ results.length } build task(s)`)

        results.forEach(result => (
          result.isSuccess ? displaySuccess(result, cli) : displayFailure(result, cli)
        ))
      })
      .catch((error) => {

      })
  }
}

export function validate (options = {}, context = {}) {
  const { project, command } = context
  const cli = project.cli

  const platform = command.action

  if (!platform) {
    cli.clear()

    cli.print()
    cli.warning({
      type: 'title',
      name: 'INVALID PLATFORM',
      message: `You specified an invalid platform.`
    })

    cli.print()
    cli.print(`${'Example'.bold}: node project build website`, 2)
    cli.print()
    cli.print('Available Compilers'.underline.green, 4)
    cli.print()

    project.available.compilers.forEach(id => (
      cli.print(`${id.bold.cyan}: ${project.getCompiler(id).info.description}`, 6)
    ))

    cli.print()
    cli.print(`${'Note'.bold.underline}: You can use ${'node project build all'.green} to build all of them`, 2)
    cli.print()
    cli.print()

    process.exit(1)
  }

  return true
}

const compilationHooks = {
  done: function(compiler, callback) {
    console.log('COMPILER DONE')
    callback()
  }
}

const compilerHooks = {
  done: function(compiler, callback) {
    console.log('COMPILER DONE')
    callback()
  }
}

const displaySuccess = (result, cli) => {

}

const displayFailure = (result, cli) => {
  console.log(result.stats.toString('normal'))
}
