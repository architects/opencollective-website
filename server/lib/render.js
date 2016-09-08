import serialize from 'serialize-javascript';
import qs from 'query-string';
import { renderToString, store } from '../../build/app'

/**
 * Example taken from redux-router documentation
 * https://github.com/acdlite/redux-router/tree/master/examples/server-rendering
 */
export default (req, res, next) => {
  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? `?${query}` : '');

  store.respond(url, (error, redirectLocation, routerState) => {
    if (error) {
      next(error)
    } else if (!routerState) {
      next()
    } else {
      store.hydrate({
        group: req.group,
        subscriptions: req.subscriptions,
        leaderboard: req.leaderboard,
        connectedAccount: req.connectedAccount,
        homepage: req.homepage
      })

      return res.render('pages/app', {
        layout: false,
        meta: req.meta,
        initialState: serialize(store.getState()),
        html: renderToString(),
      })
    }
  })
}
