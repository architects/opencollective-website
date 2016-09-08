import '../server/global'
import App, { renderToString as render, getStore } from './index' // eslint-disable-line
import createMemoryHistory from 'history/lib/createMemoryHistory'
import INITIAL_RENDER from './actions/app/initial_render'

export const store = getStore({
  routes: require('./routes.node'),
  history: createMemoryHistory,
})

export const renderToString = render
