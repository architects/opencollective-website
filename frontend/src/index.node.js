import createStore from './store/node'
import ssr from './renderers/node'
import Routes from './routes';

/**
 * Creates an express middleware compatible renderer
*/
export function middleware (store, routes = Routes) {
  store = store || createStore(routes)
  return ssr(store)
}
