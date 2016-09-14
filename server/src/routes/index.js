import renderers from './app'
import controllers from './controllers'
import proxies from './proxies'
import redirects from './redirects'
import staticAssets from './static-assets'
import mw from '../middlewares'

export default (app, options = {}) => {
  // Setup any redirects from our config
  redirects(app, options.redirects)

  // Our start has the option pass in the webpack dev compiler and middleware setup function
  if (process.env.NODE_ENV === 'development' && typeof options.middleware === 'function') {
    options.middleware(app, options)
  } else {
    // in production or in a non-hot reload dev context we use the static assets middleware
    staticAssets(app, options.assets)
  }

  // Proxy requests e.g. to our /api
  proxies(app, options.proxies)

  // Standard server rendered responses from express
  controllers(app, options.endpoints)

  // When we get here we will be using the React app to render a response
  renderers(app, {
    ssr: process.env.NODE_ENV === 'production'
  })

  app.use(mw.handleUncaughtError)
}
