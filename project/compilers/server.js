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
      renderer: frontend.srcPath('index.node'),
      client: frontend.srcPath('lib/client')
    }
  }).getConfig()

  return compiler({
    name: options.name,
    ...config,
    cache: options.cache
  })
}
