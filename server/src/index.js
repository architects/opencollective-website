import config from 'config';
import express from 'express';
import serverStatus from 'express-server-status';
import morgan from 'morgan';
import compression from 'compression';
import routes from './routes';
import views from './views';

export const app = express()

/**
 * Express app
 */

export function setup(options = {}) {
  /**
   * Locals for the templates
   */
  app.locals.version = options.version
  app.locals.SHOW_GA = (process.env.NODE_ENV === 'production');
  app.locals.publicPath = options.paths.publicPath

  app.set('publicPath', options.paths.publicPath)
  app.set('staticRoot', options.paths.frontend.output)
  app.set('renderersPath', options.paths.server.output)

  /**
   * In production we assume that we are serving assets from the staticRoot
   * and that anything we don't find should be a 404.  In development we let
   * the webpack middleware handle it.
   *
   * TODO: 404 Handling should be handled by the react-router on the client side altogether
   */
  app.set('fallbackMethod', process.env.NODE_ENV === 'production' ? 'static' : 'dev')

  app.set('trust proxy', 1) // trust first proxy for https cookies

  /**
   * Log
   */
  app.use(morgan('dev'));

  /**
   * Compress assets
   */
  app.use(compression());

  /**
   * Handlebars template engine
   */
  views(app, {
    helpers: require('./lib/formatters'),
    // TODO: Find a nicer way of syncing this value between client side handlebars
    register: [
      'currency',
      'singular',
      'titleCase'
    ]
  });

  /**
   * Server status
   */
  app.use('/status', serverStatus(app));

  routes(app)

  /**
   * Error handling
   */

  app.use((err, req, res, next) => {

    console.log('Error', err);
    console.log('Error stack', err.stack);

    if (res.headersSent) {
      return next(err);
    }

    res
    .status(err.code || 500)
    .render('pages/error', {
      layout: false,
      message: process.env.NODE_ENV === 'production' ? 'We couldn\'t find that page :(' : `Error ${err.code}: ${err.message}`,
      stack: process.env.NODE_ENV === 'production' ? '' : err.stack,
      options: {
        showGA: config.GoogleAnalytics.active
      }
    });
  });

  return app
}

export function start(app, options = {}) {
  const port = options.port || process.env.PORT || process.env.WEBSITE_PORT
  const hostname = options.host || process.env.HOST || '0.0.0.0'

  return new Promise((resolve, reject) => {
    app.listen(port, hostname, (err) => {
      err ? reject(err) : resolve(app)
    })
  })
}

app.setup = (options) => setup(options)

app.start = (options) => setup(options).start({
  port: options.port,
  host: options.host
})

export default app
