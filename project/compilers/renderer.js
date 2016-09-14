import { buildConfig, compiler } from '../webpack'

export const info = {
  name: 'renderer',
  description: 'builds modules that can render our app or components in a desired state'
}

export const create = (options = {}) => {
  const { frontend, server, copy } = options.paths

  const config = buildConfig('server', {
    entry: {
      website: [
        frontend.srcPath('index.node')
      ],

      widget: [
        frontend.srcPath('components/Widget.js')
      ]
    }
  })

  /**
   * This makes all of the server side renderer files think they are in a browser
   */
  .plugin("webpack.BannerPlugin", {
    banner:`
      var jsdom = require('jsdom').jsdom;

      global.document = jsdom('');
      global.window = document.defaultView;
      Object.keys(document.defaultView).forEach((property) => {
        if (typeof global[property] === 'undefined') {
          global[property] = document.defaultView[property];
        }
      });

      global.navigator = {
        userAgent: 'node.js'
      };
    `,
    raw: true,
    entryOnly: true
  })

  .plugin('webpack.ProvidePlugin', {
    $i18n: copy.srcPath('index.js')
  })

  .output({
    path: server.join('dist'),
    filename: 'renderers/[name].js'
  }).getConfig()

  config.plugins && config.plugins.push( ...(options.plugins || []) )

  return compiler({
    name: options.name || 'renderer',
    ...config
  })
}
