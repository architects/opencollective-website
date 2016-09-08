import { createStore, applyMiddleware, compose } from 'redux'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { reduxReactRouter } from 'redux-router'
import reducers from './reducers'
import hydrate from './actions/session/hydrate'
import defaults from 'lodash/defaults'

const devTools = global.devToolsExtension || (() => noop => noop)

const defaultInitialState = global.__INITIAL_STATE__ || {}

/**
 * Create an enhanced Redux store
 *
 * @param {Object} initialState - the default state for the store. defaults to undefined
 * @param {Object} options - the options hash
 * @param {Boolean} options.devTools - enable redux devtools, defaults to true when they're available and not explicitly
 *                                   disabled by the environment flag DISABLE_REDUX_DEVTOOLS
 * @param {Boolean} options.logging - pass true to enable redux logging middleware. by default
 * @param {Function} options.logger - logger function to use to log events from logging middleware.
 *                                  defaults to console.log
 * @param {Array} options.middlewares - an array of additional middleware functions to add to the store.
 * @param {Object} options.reducers - an object of additional reducers to combine into a root reducer for the store
 */
export function create (options = {}) {
  // set the default options
  options = defaults(options, {
    middlewares:[],
    reducers: {},
    logging: process.env.LOG_REDUX_ACTIONS,
    devTools: global.devToolsExtension && !!!process.env.DISABLE_REDUX_DEVTOOLS,
    loggerOptions: {},
    initialState: defaultInitialState,
  })

  const initialState = options.initialState

  const middlewares = [
    thunk,
    ...options.middlewares,
  ]

  if (options.logging) {
    middlewares.push(
      createLogger({
        predicate: (getState, action) => {
          return process.env.NODE_ENV === 'production'
            ? action.type.match(/FAILURE/)
            : true
        },
        ...options.loggerOptions
      })
    )
  }

  const enhancers = [
    applyMiddleware(...middlewares)
  ]

  if (options.devTools) {
    enhancers.push(devTools())
  }

  if (options.history && options.routes) {
    enhancers.push(
      reduxReactRouter({
        createHistory: options.history,
        routes: options.routes,
      })
    )
  }

  const store = createStore(
    reducers,
    initialState,
    compose(...enhancers),
  )

  Object.assign(store, {
    hydrate (withState = {}) {
      store.dispatch(hydrate(withState))
      return store
    },
    respond (url, next, finish, match) {
      store.dispatch(match(url, (error, redirectLocation, routerState) => {
        if (error) {
          next(err);
        } else if (!routerState) { // 404
          next();
        } else {
          finish(store)
        }
      }))
    }
  })

  return store
}

export default create
