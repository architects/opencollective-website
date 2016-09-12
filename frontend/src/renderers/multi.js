import React from 'react';
import { renderToString } from 'react-dom/server';
import { Provider } from 'react-redux';
import { ReduxRouter } from 'redux-router'
import { match } from 'redux-router/server';
import i18n from '../lib/i18n'
import Widget from '../components/Widget'

export const renderers = {
  website: createWebsiteRenderer,
  widget: createWidgetRenderer
}

export default renderers

/**
 * The WebsiteRender accepts a store and returns a function which can be used
 * to render a Route for any desired URL, with the Redux store hydrated with
 * whatever state data you wish to pass to it.
 */
export async function createWebsiteRenderer (store) {
  const responder = createResponder(store)

  return async function (url, dataFetcher = {}) {
    const props = await responder(url)
    const data = await dataFetcher

    const { store } = props

    const initialState = store.hydratedWith(data, true)

    const html = renderToString(
      <Provider store={store} key='provider'>
        <ReduxRouter/>
      </Provider>
    )

    return {
      url,
      html,
      initialState
    }
  }
}

/**
 Create a function to render a widget.

 @param {Function} fetchTransactions - called with slug, return Promise resolving with transactions
 @param {Function} fetchUsers - called with slug, return Promise resolving with users
 @param {Number} perPage - how many transactions per page?
 @param {String} locale - which language should it be rendered in?

 The renderer function that gets returned expects to be given a group, and options
 for how the Widget should render.
 */
export async function createWidgetRenderer (settings = {}) {
  const { fetchTransactions, fetchUsers, perPage } = settings

  return async function (group, options = {}) {
    const transactions = await fetchTransactions(group.slug, {perPage})
    const users = await fetchUsers(group.slug)
    const locale = options.locale || settings.locale || 'en'

    const props = {
      options: {
        header: (options.header !== 'false'),
        transactions: (options,transactions !== 'false'),
        donate: (options.donate !== 'false'),
        backers: (options.backers !== 'false')
      },
      group,
      i18n: i18n(locale),
      transactions,
      users,
      href: `${settings.website}/${group.slug}`
    }

    const html = renderToString(
      <Widget {...props} />
    )

    return {
      group,
      html,
      props
    }
  }
}

/**
 * createResponder accepts a store and returns a function which accepts a URL path
 * and returns a Promise that resolves with the the Router state and Redux state.
 */
export const createResponder = (store) => (url) => {
  return new Promise((resolve, reject) => {
    store.dispatch(match(url, (error, redirectLocation, routerState) => {
      if (error) {
        console.error("error in store.dispatch: ", error);
        reject(error)
      } else if (redirectLocation) {
        resolve({redirectLocation})
      } else if (!routerState) { // 404
        resolve({notFound: true})
      } else {
        resolve({
          routerState,
          store,
          url
        })
      }
    }))
  })
}
