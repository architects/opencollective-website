import config from 'config';
import defaults from 'lodash/defaults'
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

export function setup(options = require(process.cwd())) {
  const { paths, version } = options

  /**
   * Locals for the templates
   */
  app.locals.version = version
  app.locals.SHOW_GA = (process.env.NODE_ENV === 'production');
  app.locals.publicPath = paths.publicPath

  app.set('publicPath', paths.server.publicPath)
  app.set('staticRoot', paths.frontend.output)
  app.set('renderersPath', paths.server.output)

  /**
   * In production we assume that we are serving assets from the staticRoot
   * and that anything we don't find should be a 404.  In development we let
   * the webpack middleware handle it.
   *
   * TODO: 404 Handling should be handled by the react-router on the client side altogether
   */
  app.set('fallbackMethod', options.fallbackMethod || process.env.NODE_ENV === 'production' ? 'static' : 'dev')

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

  routes(app, options)

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

  app.start = (options) => start(app, options)

  return app
}

function start(app, options = {}) {
  const port = options.port || process.env.PORT || process.env.WEBSITE_PORT || 3000
  const hostname = options.host || process.env.HOST || '0.0.0.0'

  console.log('Starting app', options)

  return new Promise((resolve, reject) => {
    app.listen(port, hostname, (err) => {
      err ? reject(err) : resolve(app)
    })
  })
}

app.setup = (options) => setup(options)

export default app
