import { buildConfig, compiler } from '../webpack'

export const info = {
  name: 'server',
  description: 'a webpack compiler that compiles our server'
}

export const create = (options = {}) => {
  const { paths } = options
  const { frontend, server } = paths

  const config = buildConfig('server', {
    entry: {
      index: server.srcPath('index'),
      client: frontend.srcPath('lib/client')
    }
  })

  .output({
    filename: '[name].js'
  })

  .getConfig()

  // Disable a needless warning
  config.module = {
    ...config.module,
    exprContextRegExp: /$^/,
    exprContextCritical: false
  }

  return compiler({
    name: options.name || 'server',
    ...config,
    cache: options.cache
  })
}
