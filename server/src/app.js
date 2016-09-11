import config from 'config';
import express from 'express';
import morgan from 'morgan';
import compression from 'compression';
import pkg from '../../package.json'; // eslint-disable-line
import routes from './routes';
import views from './views';

/**
 * Express app
 */

export function setup(app = express()) {
  /**
   * Locals for the templates
   */
  app.locals.version = pkg.version;
  app.locals.SHOW_GA = (process.env.NODE_ENV === 'production');

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
  views(app);
  routes(app);

  /**
   * 404 route
   */

  app.use((req, res, next) => {
    // TODO this should redirect to a 404 page so that window location is changed
    return next({
      code: 404,
      message: 'We can\'t find that page.'
    });
  });

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

  app.start = start.bind(app, app)

  return app
}

export function start(app, options = {}) {
  app = app || setup(options)

  const port = options.port || process.env.PORT || process.env.WEBSITE_PORT
  const hostname = options.host || process.env.HOST || '0.0.0.0'

  return new Promise((resolve, reject) => {
    app.listen(port, hostname, (err) => {
      err ? reject(err) : resolve(app)
    })
  })
}

export default setup()
