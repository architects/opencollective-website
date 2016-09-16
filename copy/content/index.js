import set from 'lodash/set'
const { keys } = Object

// The require context is a webpack only feature which can require an entire folder
export const context = require.context('.', true, /.yml$/)

const sanitize = (key) => key.replace('./', '').replace(/\.yml$/, '')

// singleton cache
const data = { }

const loadContent = () =>
  context.keys().reduce((memo, key) => {
    const path = sanitize(key).replace(/\//g, '.')
    // passing a key to the context is essentially a require
    set(memo, path, context(key))
  }, data)

export default loadContent

export const available = {
  get locales() {
    return keys(data.locales)
  },

  get orgs() {
    return keys(data.orgs)
  }
}

export const refresh = () => {
  Object.keys(data).forEach(key => delete data[key])
  delete require.cache[module.id]
  return loadContent()
}

if (module.hot) {
  module.hot.accept('./locales', () => refresh())
  module.hot.accept('./orgs', () => refresh())
}
