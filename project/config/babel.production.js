module.exports = {
  // Don't try to find .babelrc because we want to force this configuration.
  babelrc: false,
  // This is a feature of `babel-loader` for webpack (not Babel itself).
  cacheDirectory: true,
  presets: [
    // disables the commonjs transforms
    require.resolve('babel-preset-opencollective-webpack')
  ]
};
