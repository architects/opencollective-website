const builder = require('../builders/frontend')
const paths = require('../../paths')

const config = builder({
  entry: {
    website: paths.frontend.relative('index.web.js')
  }
}).getConfig()
