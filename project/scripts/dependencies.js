const join = require('path').join
const relative = require('path').relative
const { handleException, outputCompilerStats } = require('../src/webpack-helpers')

export function command(commander) {
  bundleDependencies(commander)
  outdatedDependencies(commander)
}

export function bundleDependencies (commander) {
  commander
    .command(`deps:bundle [name]`)
    .description('Generate dependency bundles using webpack.DLLPlugin')
    .option('--cache-path', 'Where we output the manifest and js bundle')
    .option('--cwd', 'The root context path for the webpack build')
    .action((name, argv = {}) => {
      banner()
      msg('Packaging dependencies as a DLL', 'package')

      createDependencyBundles({
        entry: require(`../dlls/${name}`),
        outputPath: argv.outputPath || join(__dirname, '..', 'cache', 'dlls'),
        context: argv.cwd || process.cwd(),
      })
      .then((results) => outputCompilerStats(results.stats, () => successMessage(results)))
      .catch((error) => handleException(error))
    })
}

export function outdatedDependencies (commander) {
  commander
    .command(`deps:outdated`)
    .description('Check for any outdated dependencies')
}

function successMessage({stats, options}) {
  const fileNames = Object.keys(stats.compilation.assets)
  msg('Congratulations. The DLL Bundles have been generated. Expect a major speed boost.', '100')

  log(createPluginExample(fileNames, options))

  log('---' + 'Build Information'.green + '---') // eslint-disable-line
  log(`  Output path: ${shorten(options.outputPath) || join(__dirname, '..', 'cache')}`)
  log('  Files:')
  log(fileNames.map((fileName) => `    - ${fileName}`).join("\n"))
  log('-------------------------')
  log()
}

function shorten(path) {
  return relative(process.cwd(), path)
}

function createDependencyBundles(options = {}) {
  const webpack = require('webpack')
  const config = {
    context: options.context || process.cwd(),
    entry: options.entry || require('../dlls/opencollective-website'),
    devtool: 'eval',
    output: {
      filename: '[name].dll.js',
      path: options.outputPath,
      library: '[name]',
    },
    progress: true,
    stats: 'errors-only',
    plugins: [
      new webpack.DllPlugin({ name: '[name]', path: join(options.outputPath, '[name].dll.json') }),
    ],
  }

  const compiler = webpack(config)

  return new Promise((resolve,reject) => {
    compiler.run((err, stats) => {
      if (err) {
        reject(err)
      } else {
        resolve({stats, options})
      }
    })
  })
}

function createPluginExample(fileNames, options) {

return `
---${'Configuration Example'.cyan}---
  const dllPath = '${options.outputPath}'

  const config = {
    entry: './src',
    plugins: [
      new webpack.DllReferencePlugin({
        manifest: require(dllPath + '/${fileNames[0]}on'),
        context: '${options.cwd || options.context}',
      })
    ]
  }
-------
`
}
