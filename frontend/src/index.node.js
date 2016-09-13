import createStore from './store/node'
import ssr from './renderers/node'
import Routes from './routes';

import * as renderers from './renderers/multi'

/**
 * Creates an express middleware compatible renderer
*/
export function middleware (store, routes = Routes) {
  store = store || createStore(routes)
  return ssr(store)
}

export function website(store, routes = Routes) {
  store = store || createStore(routes)
  return renderers.createWebsiteRenderer(store)
}

export function widget(store, routes = Routes) {
  store = store || createStore(routes)
  return renderers.createWebsiteRenderer(store)
}
