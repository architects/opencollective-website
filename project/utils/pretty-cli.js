const { rainbow } = require('colors')
const pretty = require('pretty-cli')
const max = require('lodash/max')
const lodash = require('lodash')

const { mapValues, padEnd } = lodash

export const attach = (project, template = defaultTemplate) => {
  const cli = pretty({
    template
  })

  cli.registerCommand = (...args) => cli.addCustomMethod(...args)

  cli.addCustomMethod('print', (message = '', indentationLevel = 0) => {
    console.log(indentationLevel > 0 ? `${Array(indentationLevel).join(' ')}${message}` : message)
  })

  cli.addCustomMethod('paddedList', (items, indentationLevel) => {
    const labels = Object.keys(items)
    const width = max(labels.map(i => i.length + 1))

    mapValues(items, (data, label) => {
      label = `${label}:`
      cli.print(`${padEnd(label, width + 4)} ${data}`, 2)
    })
  })

  cli.addCustomMethod("projectInfo", () => {
    console.log()
    cli.print(`Project ${project.name.blue} ${project.version.cyan} NODE_ENV: ${process.env.NODE_ENV.green}`)
    console.log()
  })

  cli.addCustomMethod("gitInfo", () => {
    cli.print(`Git SHA: ${project.gitInfo.abbreviatedSha.yellow}`)
    cli.print(`Git Branch: ${project.gitInfo.branch.yellow}`)
  })

  cli.addCustomMethod('banner', () => {
    cli.print('')

    cli.print(
      rainbow(require('figlet').textSync('OpenCollective'))
    )

    cli.print('')
  })

  cli.addCustomMethod('clear', () => (
    process.stdout.write('\x1bc')
  ))

  cli.addCustomMethod('describeComponent', (component) => {
    require('./describe-component').describe(component, project)
  })

  return cli
}

export const defaultTemplate = {
  info: (message) => message,
  warning: (message) => message,
  error: (message) => message,
  success: (message) => message,
  note: (message) => message
}
