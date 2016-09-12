import webpack from 'webpack'
import pick from 'lodash/pick'
import mapValues from 'lodash/mapValues'
import plugin from './helpers/plugins'
import get from 'lodash/get'
import omit from 'lodash/omit'

export function createCompiler(options = {}) {

}

export function buildConfig (options = {}) {
  const {environment, platform} = options
  const configuration = getConfig(environment, platform)

  return omit(configuration, 'environment', 'platform')
}

export function getConfig(environment = process.env.NODE_ENV, platform = process.env.TARGET_PLATFORM || 'web') {

}

export default compiler
