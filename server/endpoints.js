import mw from './middlewares';
import serverStatus from 'express-server-status';
import request from 'request';
import controllers from './controllers';
import apiUrl from './utils/api_url';

module.exports = (app) => {
  /**
   * Redirects
   */
  app.get('/consciousnesshackingsf', (req, res) => res.redirect('/chsf'));
  app.get('/consciousnesshackingsv', (req, res) => res.redirect('/chsv'));

  /**
   * Server status
   */
  app.use('/status', serverStatus(app));


  /**
   * Pipe the requests before the middlewares, the piping will only work with raw
   * data
   * More infos: https://github.com/request/request/issues/1664#issuecomment-117721025
   */

  app.all('/api/*', (req, res) => {
    req
      .pipe(request(apiUrl(req.url), { followRedirect: false }))
      .pipe(res);
  });

  /**
   * Routes
   */
  app.get('/:slug/banner.md', mw.cache(300), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.markdown);
  app.get('/:slug/banner.js', mw.cache(3000), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.js);
  app.get('/:slug/:tier.md', mw.cache(300), mw.fetchGroupBySlug, mw.fetchActiveUsers(), controllers.banner.markdown);
  app.get('/:slug/:tier.:format(svg|png)', mw.cache(300), mw.fetchActiveUsers(), controllers.banner.banner);
  app.get('/:slug/:tier/badge.svg', mw.cache(300), mw.fetchActiveUsers(), controllers.banner.badge);
  app.get('/:slug/badge/:tier.svg', mw.cache(300), mw.fetchActiveUsers(), controllers.banner.badge);
  app.get('/:slug/:tier/:position/avatar(.:format(png|jpg|svg))?', mw.cache(300), mw.ga, mw.fetchActiveUsers({cache: 300}), controllers.banner.avatar);
  app.get('/:slug/:tier/:position/website', mw.ga, mw.fetchActiveUsers(), controllers.banner.redirect);
  app.get('/:slug([A-Za-z0-9-]+)/widget', mw.cache(300), mw.fetchGroupBySlug, controllers.collectives.widget);

  app.use(mw.handleUncaughtError)
};
