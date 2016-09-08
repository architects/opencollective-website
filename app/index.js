import React, { propTypes as types } from 'react'
import { create as createStore } from './store'
import { ReduxRouter } from 'redux-router'
import { Provider } from 'react-redux'

export const App = (props = {}) => {
  const { store } = props.store

  return (
    <Provider store={store}>
      <ReduxRouter />
    </Provider>
  )
}

export default App

let store = undefined

export function getStore(options) {
  return store || createStore(options)
}

export function renderToString(props = {}, ...args) {
  return require('react-dom/server').renderToString(
    <App {...props} />,
    ...args,
  )
}

export function render(props = {}, containerElement, ...args) {
  return require('react-dom').render(
    <App {...props} />,
    containerElement,
    ...args,
  )
}
