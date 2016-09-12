const argv = require('minimist')
const path = require('path')

process.env.NODE_ENV = argv.env || process.env.NODE_ENV || 'development'

if (process.env.NODE_ENV === 'development') {
  require('dotenv').load()
}

const paths = require('../project/paths')
process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || paths.server.config || path.join(__dirname, 'config')
