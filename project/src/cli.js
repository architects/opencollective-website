process.env.NODE_ENV = process.env.NODE_ENV || 'development'
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || `${process.cwd()}/server/config`

const { join } = require('path')
//const readdir = require('fs').readdirSync
const pkg = require('../package.json')
const exists = require('fs').existsSync
const readJSON = require('fs-extra').readJSONSync

export function run() {
  const currentProject = loadProject()
  const cli = program()

  require('../scripts/start').command(cli)
  require('../scripts/build').command(cli)
  require('../scripts/analyze').command(cli)
  require('../scripts/dependencies').command(cli)
  require('../scripts/lint').command(cli)
  require('../scripts/test').command(cli)
  require('../scripts/repl').command(cli)

  // TODO
  // When run in global mode, load the current project scripts on top of this
  cli.launch()
}

export function loadProject (cwd = process.cwd()) {
  const findUp = require('findup-sync')

  const project = {
    root: exists(join(process.cwd(),'package.json'))
      ? process.cwd()
      : findUp('package.json', {cwd: cwd}),

    get parent() {
      return dirname(project.root)
    },

    get pkg() {
      return exists(join(project.root, 'package.json'))
        ? readJSON(join(project.root, 'package.json'))
        : false
    }
  }

  return project
}

export function program() {
  const commander = require('commander')
  const program = commander

  program
    .description('OpenCollective Devtools')
    .usage('oc-dev <command> [options]')
    .version(pkg.version)
    .option('--debug', 'enable debugging')

  Object.assign(program, {
    get currentProject() {
      return loadProject()
    }
  })

  program.launch = () => {
    if (!process.argv.slice(2).length) {
      banner()
      program.outputHelp()
    } else {
      program.parse(process.argv)
    }
  }

  return program
}
