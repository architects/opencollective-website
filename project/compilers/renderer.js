import { buildConfig, compiler } from '../webpack'
import plugins from '../webpack/plugins'

export const info = {
  name: 'renderer',
  description: 'builds a module that can render our app or components in a desired state'
}

export const create = (options = {}) => {
  const { frontend, server } = options.paths

  const config = buildConfig('server', {
    entry: {
      website: [
        frontend.srcPath('index.node')
      ]
    }
  }).getConfig()

  return compiler({
    name: options.name,
    ...config,
    cache: options.cache
  })
}
