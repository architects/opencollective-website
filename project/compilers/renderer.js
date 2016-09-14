import { buildConfig, compiler } from '../webpack'

export const info = {
  name: 'renderer',
  description: 'builds modules that can render our app or components in a desired state'
}

export const create = (options = {}) => {
  const { frontend, server } = options.paths

  const config = buildConfig('server', {
    entry: {
      website: [
        // makes our i18n library available globally without ever having to require it
        `expose?global.$i18n!${frontend.srcPath('lib/i18n.js')}`,
        frontend.srcPath('index.node')
      ],

      widget: [
        `expose?global.$i18n!${frontend.srcPath('lib/i18n.js')}`,
        frontend.srcPath('components/Widget.js')
      ],

      i18n: [
        `${frontend.srcPath('lib/i18n.js')}`
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
