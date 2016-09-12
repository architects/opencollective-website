const pretty = require('pretty-cli')
const colors = require('colors')
const emoji = require('node-emoji')

const infoIcon = 'I'.bgBlue.black
const errorIcon = 'E'.bgRed.white
const logIcon = 'L'.bgWhite.black
const warnIcon = 'W'.bgYellow.black

export const template = ({
  error: (message) => ` ${errorIcon} ${message}`,
  info: (message) => ` ${infoIcon} ${message}`,
  log: (message) => ` ${logIcon} ${message}`,
  warn: (message) => ` ${warnIcon} ${message}`,
  print: (message) => `  ${message}`,
  subprint: (message) => `    ${message}`,
  banner: (header) => (
    `${colors.rainbow(require('figlet').textSync(header))}\n`
  )
})

export const cli = pretty({
  template
})

cli.addCustomMethod('label', (message, glyph) => (
  cli.print(`${emoji.get(glyph)}  ${message}`)
))

export function start(project = {}) {
  if (project.cliOptions.help) {
    showHelp(project)
    return
  }

  switch (project.command) {
    case 'console':
      showInfo(project)
      project.startRepl({}, {project})
      break;

    case 'build':
      cli.label('Building the project.', 'package')
      showInfo(project)
      break;

    case 'start':
      cli.banner('OpenCollective')
      cli.label('Starting the project.', 'rocket')
      showInfo(project)

      require('./scripts/start')(project.cliOptions, {
        env: process.env.NODE_ENV || 'development',
        project
      })

      break;

    case 'help':
    default:
      showHelp(project)
  }
}

const showInfo = (project) => {
  console.log()
  cli.print(`Project ${project.name.blue} ${project.version.cyan} NODE_ENV: ${process.env.NODE_ENV.green}`)
  cli.print(`Git SHA: ${project.gitInfo.abbreviatedSha.yellow}`)
  cli.print(`Git Branch: ${project.gitInfo.branch.yellow}`)
  console.log()
}

const showHelp = (project) => {
  console.log()
  console.log()
  cli.banner('OpenCollective')
  cli.print('Available Commands:\n')
  cli.subprint(`${'console'.yellow} - Start a debug console`)
  cli.subprint(`${'info'.cyan} - See information related to the project`)
  cli.subprint(`${'start'.green} - Start the project server`)
  cli.subprint(`${'generate'.blue} - Generate common project assets`)
  cli.subprint(`${'test'.magenta} - Run project test suites`)
  cli.subprint(`${'open'.white} - Open the project in your web browser`)
  console.log()
  console.log()
  cli.print('Example:\n')
  cli.subprint('node project start ')
}
