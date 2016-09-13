import findCache from 'find-cache-dir'
import compact from 'lodash/compact'

export default (options) => ({
  // Ignore the project's babelrc
  babelrc: false,

  // Creates a cache in node_modules/.cache
  cacheDirectory: findCache({
    name: 'opencollective-website'
  }),

  presets: resolvePaths([
    "babel-preset-es2015",
    "babel-preset-stage-0",
    "babel-preset-react",
    // Use the HMR transforms unless opted out
    (options.hot !== false
        ? "babel-preset-react-hmre"
        : null)
  ]),

  plugins: resolvePaths([
    "babel-plugin-add-module-exports",
    "babel-plugin-lodash",
    "babel-plugin-transform-export-extensions",
    "babel-plugin-transform-async-to-generator",
    "babel-plugin-transform-regenerator"
  ])
})

const resolvePaths = (shortNames) =>
  compact(shortNames).map(require.resolve)
