const join = require('path').join
const readdirSync = require('fs').readdirSync

if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  process.env.NODE_ENV = 'development'
  require('dotenv').load();
}

require('babel-register')({
  presets: [
    require.resolve('babel-preset-opencollective')
  ]
})

const project = {
  buildPath(...args) {
    return join(project.paths.build, ...args)
  },
  get paths() {
    return {
      build: join(process.cwd(), 'build'),
      app: join(process.cwd(), 'app'),
      server: join(process.cwd(), 'server'),
      projectStats: join(__dirname, 'stats'),
      dependencyBundles: join(__dirname, 'cache', 'dlls'),
    }
  },
  get statsFiles() {
    return readdirSync(
      join(__dirname, 'stats')).filter(f => f.match(/\.json/)
    )
  }
}

module.exports = project

if (require.main === module) {
  require('./src/global-shell-helpers')
  require('./src/cli').run()
}
