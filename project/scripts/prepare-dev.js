const project = require('..').project

/* eslint-disable */
const copy = project.compiler('copy')
const renderers = project.compiler('renderer')
const server = project.compiler('server')
const website = project.compiler('website')
const Promise = require('bluebird')

Promise.all([
  copy.start(),
  renderers.start(),
  server.start(),
  website.start()
])
.then((results) => {
  results.forEach(result => {
    const { report, stats } = result

    if (report.hasErrors) {
      project.cli.print('Failure:'.red, 4)
      console.log(
        stats.toString('errors-only')
      )
    } else {
      project.cli.print('\n')
      project.cli.print(`Results for ${stats.compilation.name}`.green.underline, 2)
      stats.toString('minimal').split("\n").forEach(line => {
        project.cli.print(line, 6)
      })
    }
  })
})
