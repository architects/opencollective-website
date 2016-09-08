import '../server/global'
import App, { renderToString as render, getStore } from './index' // eslint-disable-line
import { reduxReactRouter, match } from 'redux-router/server'
import createMemoryHistory from 'history/lib/createMemoryHistory'

export const store = getStore({
  routes: require('./routes.node'),
  history: createMemoryHistory,
  reduxReactRouter,
  match
})

export const renderToString = (props = {}) => render({
  ...props,
  store,
})
