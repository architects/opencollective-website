import moment from 'moment'
import 'moment/locale/es'
import 'moment/locale/fr'
import lodash from 'lodash'

moment.locale('en');

export const req = require.context('.', true, /.yml$/)

export const keys = req.keys().map(k => sanitize(k))

const sanitize = (key) =>
  key.replace('./', '').replace(/\.yml$/, '')

export const data = () => {
  const result = {}

  req.keys().forEach(key => {
    lodash.set(key.split('/')[0], {})
    lodash.set(key.split('/'), req(key))
  })

  return result
}

export const available = {
  get locales() {
    return lodash.uniq(keys
      .filter(k => k.startsWith('locales'))
      .map(k => k.split('/')[0]))
  },

  get orgs() {
    return lodash.uniq(keys
      .filter(k => k.startsWith('orgs'))
      .map(k => k.split('/')[0]))
  }
}

export default (lang) => {
  moment.locale(lang)
}
