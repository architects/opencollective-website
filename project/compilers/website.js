import { buildConfig, compiler } from '../webpack'
import plugins from '../webpack/plugins'

export const info = {
  name: 'website',
  description: 'compiles static assets from our frontend'
}

export const create = (project, options = {}) => {
  const frontend = project.paths
  const css = (...args) => frontend.relative('css', ...args)

  const { plugin, loader } = plugins.styleExtractor({
    loaders: ['css', 'postcss'],
    name: '[name].css'
  })

  const config = buildConfig('web', {
    entry: {
      main: `!!${loader}!${css('main.css')}`,
      widget: `!!${loader}!${css('widget.css')}`
    }
  })

  .plugin('webpack-shell-plugin', {
    onBuildStart: [
      'gulp build:svg'
    ]
  })
  .getConfig()

  config.plugins.push(plugin)

  if (options.cache) {
    config.cache = options.cache
  }

  return compiler(config)
}
