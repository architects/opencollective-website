import get from 'lodash/get'
import currency from './currency'
import inflect from './inflect' // eslint-disable-line
import moment from './moment-locales'
import content from '../content'

export const CONFIG = {
  "locales": {
    "main": "en",
    "sourceFolders": [
      "content/locales",
      "content/orgs"
    ]
  }
}

export const DEFAULT_LOCALE = CONFIG.locales.main

let currentLocale = DEFAULT_LOCALE

export const lang = (lang = currentLocale) => {
  moment(currentLocale = lang || DEFAULT_LOCALE)

  const helpers = {
    get currentLocale() {
      return currentLocale
    },

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
export default lang() // eslint-disable-line
