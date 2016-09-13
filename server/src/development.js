import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware'

export default (app, compiler) => {
  const middleware = webpackDevMiddleware(compiler, {
    noInfo: true,
    publicPath: compiler.options.output.publicPath,
    silent: true,
    stats: 'normal'
  });

  app.use(middleware);
  app.use(webpackHotMiddleware(compiler));
}
