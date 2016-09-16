/* eslint-disable */

import middleware, { createMiddleware, store, getRoutes } from '../../frontend/dist/universal/middleware'
import WidgetComponent from '../../frontend/dist/universal/widget'

export default (...args) => {
  return middleware(...args)
}

export const Widget = WidgetComponent

if (module.hot) {
  console.log('SSR With HMR')

  module.hot.accept('../../frontend/dist/universal/middleware', () => {
    console.log('WE GOT A HMR UPDATE FOR MIDDLEWARE')
  })

  module.hot.accept('../../frontend/dist/universal/widget', () => {
    console.log('WE GOT A HMR UPDATE FOR THE WIDGET')
  })
}
