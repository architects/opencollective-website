import express from 'express';
import { join } from 'path'
import morgan from 'morgan';
import config from 'config';
import compression from 'compression';
import defaults from 'lodash/defaults'

import pkg from '../package.json';

export function create(options = {}) {
  /**
   * Express app
   */
  const app = express();

  Object.assign(app, {
    get project() {
      return require('../project')
    }
  })

  /**
   * Port config
   */
  app.set('port', options.port || process.env.WEBSITE_PORT || process.env.PORT || 3000);

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
  require('./views')(app, options);
  require('./static')(app, options)
  require('./endpoints')(app, options);
  require('./routes')(app, options);

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


  return app
}

export default create
