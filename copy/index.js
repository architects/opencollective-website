import moment from 'moment'
import 'moment/locale/es'
import 'moment/locale/fr'
import lodash from 'lodash'
import currency from './currency'

moment.locale('en');

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
    lodash.set(result, path, req(key))
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

  return {
    get allStrings() {
      return lodash.get(content.locales, lang)
    },
    getString(id) {
      return lodash.get(
        content.locales,
        [lang, id],
        // fallback to en
        lodash.get(content.locales, ['en', id])
      )
    },
    moment,
    currency
  }
}

export default lang(global.__LOCALE__ || process.env.DEFAULT_LOCALE || 'en')
