const path = require('path')
const resolvePaths = (moduleIds) => moduleIds.map(id => require.resolve(id))

export default (options) => ({
  // Ignore the project's babelrc
  babelrc: false,

  presets: resolvePaths([
    "babel-preset-latest",
    "babel-preset-react"
  ]),

  plugins: resolvePaths([
    "babel-plugin-add-module-exports",
    "babel-plugin-lodash"
  ]).concat([
    require.resolve('babel-plugin-transform-class-properties'),

    require.resolve('babel-plugin-transform-object-rest-spread'),

    [require.resolve('babel-plugin-transform-regenerator'), {
      // Async functions are converted to generators by babel-preset-latest
      async: false
    }],

    [require.resolve('babel-plugin-transform-runtime'), {
      helpers: false,
      polyfill: false,
      regenerator: true,
      moduleName: path.dirname(require.resolve('babel-runtime/package'))
    }]
  ])
})
