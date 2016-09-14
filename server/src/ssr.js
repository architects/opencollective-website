import vm from 'vm'
import result from 'lodash/result'
import localStorage from 'localmockage';
import fs from 'fs'
import { join } from 'path'

export class ServerSideRenderer {
  static create(app, options = {}) {
    console.log('Creating a server side renderer')
    const renderer = new ServerSideRenderer(options, {
      publicPath: app.get('publicPath')
    })

    renderer.registerRenderer(
      join(app.get(''))
    )

    return renderer
  }

  constructor (options = {}, context = {}) {
    this.handlers = {}
    this.scripts = {}

    this.context = {
      localStorage,
      window: {
        location: {},
        addEventListener: () => {},
        ...options.window
      },
      ...context
    }
  }

  run (name, params = {}) {
    const script = this.loadRenderer(name)

    return new Promise((resolve,reject) => {
      vm.runInContext(script, {
        ...this.context,
        ...params,
        finished: (err, result) => {
          err ? reject(err) : resolve(result)
        }
      })
    })
  }

  loadRenderer (name, options) {
    return result(this.scripts, name, () => this.scripts[name] = createScript(this.handlers[name], options))
  }

  registerRenderer (name, modulePath) {
    if (this.scripts[name]) {
      delete this.scripts[name]
    }

    this.handlers[name] = modulePath
  }
}

export default ServerSideRenderer

const createScript = (modulePath, options) =>
  new vm.Script(fs.readFileSync(modulePath).toString(), options)
