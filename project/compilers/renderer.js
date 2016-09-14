import { buildConfig, compiler } from '../webpack'

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
      ],

      widget: [
        frontend.srcPath('components/Widget.js')
      ],

      i18n: [
        frontend.srcPath('lib/i18n.js')
      ]
    }
  })

  .output({
    path: server.join('dist'),
    filename: 'renderers/[name].js'
  }).getConfig()

  return compiler({
    name: options.name || 'renderer',
    ...config
  })
}
