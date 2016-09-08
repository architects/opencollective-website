const webpack = require('webpack')
const spawn = require('child_process').spawnSync
const defaults = require('lodash/defaults')
const { handleException, outputCompilerStats } = require('../src/webpack-helpers')

export function command (commander) {
  commander
    .command(`build`)
    .description('Generate a static build of the project')
    .allowUnknownOption(true)
    .option('--env', 'Which environment?', process.env.NODE_ENV)
    .action((argv = {}) => {

      Promise.all([
        runWebpackBuild('node', argv),
        runWebpackBuild('browser', argv),
      ])
      .then((results) => {
        results.forEach((stats) => {
          console.log('Stats', stats.hasErrors, stats.hasWarnings, stats.stats)
        })
      })
    })
}

function runWebpackBuild(target, argv = {}) {
  const environment = argv.env || 'development'
  const config = target === 'node'
    ? require('../config/webpack/node')(environment, argv)
    : require('../config/webpack/web')(environment, argv)

  const compiler = webpack(config)

  return new Promise((resolve, reject) => {
    compiler.run((err,stats) => {
      if (err) {
        reject(err)
      } else {
        resolve({
          hasErrors: stats.hasErrors(),
          hasWarnings: stats.hasWarnings(),
          stats: stats.toJson(),
        })
      }
    })
  })
}
