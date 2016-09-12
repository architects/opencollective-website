import path from 'path';
import hbs from 'express-hbs';
import config from 'config';
import * as formatters from '../lib/formatters'
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'

// We declare these so that we can configure handlebars for use with webpack
export const knownHelpers = [
  'currency',
  'singular',
  'titleCase'
]

export const helpers = {
  ...pick(formatters, knownHelpers)
}

export default (app, options = {}) => {
  // Option to pass in helpers from the outside
  options = { helpers, helperNames: knownHelpers, ...options }

  mapValues(pick(options.helpers, options.helperNames), (helper, name) => (
    hbs.registerHelper(name, helper)
  ))

  app.engine('hbs', hbs.express4({
    partialsDir: path.join(__dirname, '/partials'),
    defaultLayout: path.join(__dirname, '/layouts/default')
  }));

  app.set('view engine', 'hbs');
  app.set('views', __dirname);
  app.set('view cache', config.viewCache);
}
