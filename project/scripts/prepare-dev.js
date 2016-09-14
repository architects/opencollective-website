require('colors')

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

    const outputPath = project.paths.relative(stats.compilation.compiler.outputPath)

    if (stats.hasErrors() || stats.hasWarnings()) {
      project.cli.print('Failure:'.red, 4)
      project.cli.print('-------', 2)
      project.cli.print(
        stats.toString('errors-only').split("\n"), 6
      )
    } else {
      project.cli.print('-------', 2)
      project.cli.print(`Output: ${outputPath}`, 2)
      project.cli.print('Chunks:', 2)
      stats.toString('minimal').split("\n").forEach(line => {
        project.cli.print(line, 6)
      })
    }
  })
})
