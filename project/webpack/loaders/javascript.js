const configs = {
  production: require('../config/babel.production'),
  development: require('../config/babel.development')
}

export const babelHotLoader = (options = {}) => ({
  ...babelLoader({
    options,
    config: configs.development({hot:true})
  })
})

export const babelLoader = (options = {}) => ({
  query: {
    ...configs.production(),
    ...(options.config || {})
  },
  include: (options.sourcePaths || []).concat(options.include || []),
  exclude: [/node_modules/].concat(options.exclude || [])
})
