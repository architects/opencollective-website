  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') {
  require('dotenv').load();
}

process.env.NODE_CONFIG_DIR = process.env.NODE_CONFIG_DIR || join(__dirname, 'config')

require('./global');

require('babel-register')({
  presets: ['opencollective'],
  only: [
    __dirname
  ] 
})

const join = require('path').join
const createApp = require('./app').create

function create(options) {
  const app = createApp(options)

  app.start = function() {
    /**
     * Start server
     */
    console.log(`Starting OpenCollective Website Server on port ${app.get('port')} in ${app.get('env')} environment.`);

    app
      .listen(app.get('port'))
      .on('error', (err) => {
        if (err.errno === 'EADDRINUSE')
          console.error('Error: Port busy');
        else
          console.log(err);
      });
  }

  return app
}

module.exports = {
  create,
}

if (require.main === module) {
  create().start()
}
