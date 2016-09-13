import { buildConfig, compiler } from '../webpack'
import plugins from '../webpack/plugins'

export const info = {
  name: 'website',
  description: 'compiles the website assets for our frontend'
}

export const create = (options = {}) => {
  const { frontend } = options.paths

  const config = buildConfig('web', {
    entry: {
      website: frontend.srcPath('index.web')
    }
  })

  return compiler({
    name: options.name,
    ...config,
    cache: options.cache
  })
}
