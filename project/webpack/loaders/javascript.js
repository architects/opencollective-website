import development from '../../config/babel.development'
import production from '../../config/babel.production'

export const babelHotLoader = (options) => ({
  test: /\.js$/,
  loader: 'babel',
  query: {
    babelrc: false,
    ...development({
      hot: options.hot !== false
    })
  },
  include: options.include,
  exclude: options.exclude
})

export const babelLoader = (options = {}) => ({
  test: /\.js$/,
  query: {
    ...production(),
    babelrc: false
  },
  include: options.include,
  exclude: options.exclude
})
