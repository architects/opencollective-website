import get from 'lodash/get'
import set from 'lodash/set'
import currency from './currency'
import inflect from './inflect' // eslint-disable-line
import moment from './moment-locales'

// The require context is a webpack only feature which can require an entire folder
export const req = require.context('.', true, /.yml$/)

const sanitize = (key) => key.replace('./', '').replace(/\.yml$/, '')

export const refresh = () => {
  delete(require.cache[module.id])
  return module.exports
}

export const data = () => {
  const result = {}

  req.keys().forEach(key => {
    const path = sanitize(key).replace(/\//g, '.')
    set(result, path, req(key))
  })

  return result
}

export const available = {
  get locales() {
    return Object.keys(data().locales)
  },

  get orgs() {
    return Object.keys(data().orgs)
  }
}

export const lang = (lang) => {
  moment.locale(lang)

  const content = data()

  const helpers = {
    // an alias to getString
    t (...args) {
      return helpers.getString(...args)
    },

    // request multiple values and get an object with keys matching the desired value
    strings (...keys) {
      return keys.reduce(
        (memo, id) => Object.assign(memo, {[id]: helpers.t(id)}),
        {}
      )
    },

    getString (id, fallbackValue) {
      return get(
        content.locales,
        [lang, id],
        // fallback to en unless a fallback is specified
        typeof fallbackValue === 'string'
          ? fallbackValue
          : get(content.locales, ['en', id])
      )
    },

    get allStrings() {
      return get(content.locales, lang)
    },

    setLocale(lang) {
      return lang(lang)
    },

    // raw access to the moment library
    moment,

    // format currency
    currency

  }

  return {
    // add the inflect helpers
    ...inflect,
    ...helpers
  }
}

// TODO: we can export this with different default locales
export default lang(__LOCALE__)
