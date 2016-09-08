import App, { render, getStore } from './index' // eslint-disable-line
import createBrowserHistory from 'history/lib/createBrowserHistory'
import INITIAL_RENDER from './actions/app/initial_render'

const store = getStore({
  routes: require('./routes.web'),
  history: createBrowserHistory,
})

render(
  document.getElementById('content'),
  () => store.dispatch({
    type: INITIAL_RENDER,
  })
)
