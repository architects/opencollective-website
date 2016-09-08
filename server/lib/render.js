import serialize from 'serialize-javascript';
import qs from 'query-string';
import { renderToString, store } from '../../build/app'
import { match } from 'redux-router/lib/server'

/**
 * Example taken from redux-router documentation
 * https://github.com/acdlite/redux-router/tree/master/examples/server-rendering
 */
export default (req, res, next) => {
  const query = qs.stringify(req.query);
  const url = req.path + (query.length ? `?${query}` : '');

  store.respond(url, next, () => {
    store.hydrate({
      group: req.group,
      subscriptions: req.subscriptions,
      leaderboard: req.leaderboard,
      connectedAccount: req.connectedAccount,
      homepage: req.homepage
    })

    const initialState = serialize(store.getState());

    res.render('pages/app', {
      layout: false,
      meta: req.meta || {},
      html: renderToString({store}),
      initialState
    });
  }, match)
}
