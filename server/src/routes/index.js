import app from './app'
import controllers from './controllers'
import proxies from './proxies'
import redirects from './redirects'
import staticAssets from './static-assets'

export default (app, options = {}) => {
  redirects(app, options.redirects)
  pro
}
