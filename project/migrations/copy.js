/* eslint-disable */

try {
  const strings = require(project.paths.frontend.join('src/ui/strings.json'))
  const toYaml = require('js-yaml').dump

  cli.print(`Updating the site copy defintions`)

  mapValues(strings, (data, base) => {
    const dest = project.paths.join(`copy/${base}.yml`)

    cli.print(`Updating ${base}`)

    project.fsx.writeFile(
      dest,
      toYaml(data),
      'utf8'
    )
  })
} catch(error) {
  console.log('ERROR', error)
}
