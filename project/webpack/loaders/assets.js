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
