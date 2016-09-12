/**
 * Webpack Configuration Presets
 *
 * Provides a system for taming the different webpack configurations.
 * A preset will usually correspond to an environment and target platform,
 * e.g. development.web or production.node
 */
export class Preset {
  constructor (options = {}) {

  }

  /**
   * Lists the available configuration profiles, which will usually correspond to
   * the different environments (development, test, production)
   */
  static get available() {
    return context().keys()
      .map(key => key.replace(/^\.\//).replace(/\.js$/))
  }

  static load(presetId) {
    return context()(`./${presetId}.js`)
  }

}

export const context = () => require.context('.', true, /\w+\/index.js$/)
