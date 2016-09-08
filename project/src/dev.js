module.exports = function (app, options) {
  const webpack = require('webpack')
  const compiler = webpack(
    require('../config/webpack/web')('development', options)
  )

  const devMiddleware = require('webpack-dev-middleware')(compiler, {
    stats: 'normal',
    publicPath: options.publicPath || '/static/',
  })

  const hotMiddleware = require('webpack-hot-middleware')

  app.use(devMiddleware)
  app.use(hotMiddleware(compiler))

  return app
}
