import { buildConfig, compiler } from '../webpack'

export const info = {
  name: 'copy',
  description: 'bundles our copy files into a universal javascript module'
}

export const create = (options = {}) => {
  const { paths } = options

  const main = config({
    entry: { index: paths.copy.srcPath('index.js') },
    mod: (b) => b.plugin('webpack.DefinePlugin', {__LOCALE__: 'en'}),
    paths
  })

  const defaultLang = (lang) =>
    config({
      entry: paths.copy.srcPath('index.js'),
      filename: `langs/${lang}.js`,
      paths,
      mod: (b) => b.plugin('webpack.DefinePlugin', {__LOCALE__: lang})
    })

  return compiler(
    [main].concat(['en', 'fr', 'es', 'it'].map(lang => defaultLang(lang)))
  )
}

export const config = (options = {}) => {
  const { paths } = options

  const builder = buildConfig('server', {
    entry: options.entry
  })

  .sourcemap(false)

  .output({
    path: paths.copy.output,
    filename: options.filename || '[name].js'
  })

  .loader('babel', '.js', {
    include:[paths.copy.src],
    exclude:[
      /node_modules/,
      paths.copy.output
    ]
  })

  .loader('yaml', '.yml', {
    include:[paths.copy.src],
    loader: 'json!yaml',
    exclude:[
      /node_modules/,
      paths.copy.output
    ]
  })

  // SEE https://github.com/moment/moment/issues/1435#issuecomment-232687733
  // prevents loading all the locales
  .plugin('webpack.IgnorePlugin', /^\.\/locale$/, /moment$/)

  return options.mod
    ? options.mod(builder, options).getConfig()
    : builder.getConfig()
}
