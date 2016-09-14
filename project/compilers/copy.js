import { buildConfig, compiler } from '../webpack'

export const info = {
  name: 'copy',
  description: 'bundles our copy files into a universal javascript module'
}

export const create = (options = {}) => {
  const { paths } = options
  const { frontend, server } = paths

  const config = buildConfig('server', {
    entry: {
      copy: paths.join('copy/index')
    }
  })

  .sourcemap(false)

  .output({
    path: frontend.output,
    filename: '[name].js'
  })

  .loader('babel', '.js', {
    include:[paths.join('copy')],
    exclude:[/node_modules/]
  })

  .getConfig()

  // Disable a needless warning
  config.module = {
    ...config.module,
    exprContextRegExp: /$^/,
    exprContextCritical: false
  }

  config.module.loaders.push({
    loader: 'json!yaml',
    test: /\.yml/,
    include: [
      paths.join('copy')
    ]
  })

  config.plugins && config.plugins.push( ...(options.plugins || []) )

  return compiler({
    name: options.name || 'copy',
    ...config
  })
}
