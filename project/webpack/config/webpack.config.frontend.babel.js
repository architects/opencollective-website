import frontend from '../builders/frontend'
import postcssConfig from './postcss'
import AssetManifestPlugin from '../plugins/asset-manifest'
import MissingModules from '../plugins/watch-node-modules'

module.exports = function(env) {
  const project = require('../../index')
  const paths = project.paths

  const builder = frontend({
    entry: {
      website: paths.frontend.relative('index.web.js')
    }
  }, project)

  const config = builder.getConfig()

  config.plugins.push(
    new MissingModules(paths.node_modules),
    new AssetManifestPlugin({
      output: 'frontend/dist/asset-manifest.json'
    })
  )

  config.postcss = postcssConfig

  config.eslint = {
    configFile: require.resolve('./eslint.js'),
    useEslintRc: false
  }

  return config
}
