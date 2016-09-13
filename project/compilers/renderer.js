import { buildConfig, compiler } from '../webpack'
import plugins from '../webpack/plugins'

export const info = {
  name: 'renderer',
  description: 'builds a module that can render our app or components in a desired state'
}

export const create = (project, options = {}) => {
  const { frontend, server } = project.paths

  const config = buildConfig('server', {
    entry: {
      website: [
        frontend.relative('index.node')
      ]
    }
  }).getConfig()

  if (options.cache) {
    config.cache = options.cache
  }

  return compiler(config)
}
