import defaults from 'lodash/defaults'
import { join } from 'path'
import { knownHelpers } from '../server/views'

export function websiteViews(options = {}) {
  defaults(options, {
    helperDirs: [
      join(process.cwd(), 'server', 'src', 'views', 'helpers')
    ].concat(options.helperDirs || []),
    partialDirs: [
      join(process.cwd(), 'server', 'src', 'views', 'partials')
    ].concat(options.partialDirs || []),
    knownHelpers: knownHelpers.concat(options.knownHelpers || [])
  })

  return {
    test: /\.(hbs|handlebars)$/,
    loader: 'handlebars',
    query: {
      helperDirs: options.helperDirs,
      partialDirs: options.partialDirs,
      knownHelpers: options.knownHelpers
    }
  }
}
