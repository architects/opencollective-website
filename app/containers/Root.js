import React from 'react'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'

export const Root = (props = {}) =>
  <Provider store={props.store}>
    <ReduxRouter />
  </Provider>
