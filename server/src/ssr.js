import vm from 'vm'
import result from 'lodash/result'
import localStorage from 'localmockage';
import fs from 'fs'

export class ServerSideRenderer {
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

const createScript = (modulePath, options) =>
  new vm.Script(fs.readFileSync(modulePath).toString(), options)
