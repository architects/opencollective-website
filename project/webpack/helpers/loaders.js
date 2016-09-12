import pick from 'lodash/pick'

export function babelLoader(options = {}) {
  const presets = options.presets || ['es2015-webpack', 'stage-0', 'react']

  if (options.hot) {
    presets.push('react-hmre')
  }

  return {
    test: /\.js$/,
    loader: 'babel',

    query: {
      babelrc: false,
      cacheDirectory: true,
      presets,
      plugins: [
        "add-module-exports",
        "lodash"
      ]
    },
    ...(pick(options, 'include', 'exclude'))
  }
}

export function imageLoader(environment, settings = {}) {
  if (environment !== 'production') {
    return ['file-loader']
  }

  const imageOptimizations = {
    progressive:true,
    optimizationLevel: 7,
    interlaced: false,
    pngquant:{
      quality: "65-90",
      speed: 4
    },
    ...settings
  }

  return [
    'file-loader',
    `image-webpack?${JSON.stringify(imageOptimizations)}`
  ]
}
