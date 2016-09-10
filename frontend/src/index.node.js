import createStore from './store/node'
import ssr from './renderers/node'
import Routes from './routes';

/**
 * Create a function that can be used to render any URL
 * in the context of our redux store. Uses the current
 * store / routes automatically, but can be passed new
 * instances for dev / test / debug purposes.
*/
export function renderer (store, routes = Routes) {
  store = store || createStore(routes)

  return ssr(store)
}


export default renderer
