import mw from '../middlewares'
import * as controllers from '../controllers'

export default (app) => {
  app.get('/:slug/banner.md', mw.cache(300), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.markdown);
  app.get('/:slug/banner.js', mw.cache(3000), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.js);
  app.get('/:slug/:tier.md', mw.cache(300), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.markdown);
  app.get('/:slug/:tier.:format(svg|png)', mw.cache(300), mw.fetchActiveUsers(), controllers.banner.banner);
  app.get('/:slug/:tier/badge.svg', mw.cache(300), mw.fetchActiveUsers(), controllers.banner.badge);
  app.get('/:slug/badge/:tier.svg', mw.cache(300), mw.fetchActiveUsers(), controllers.banner.badge);
  app.get('/:slug/:tier/:position/avatar(.:format(png|jpg|svg))?', mw.cache(300), mw.ga, mw.fetchActiveUsers({cache: 300}), controllers.banner.avatar);
  app.get('/:slug/:tier/:position/website', mw.ga, mw.fetchActiveUsers(), controllers.banner.redirect);
  app.get('/:slug([A-Za-z0-9-]+)/widget', mw.cache(300), mw.fetchGroupBySlug, controllers.collectives.widget);
}
