export class LowcodePluginRuntime {
  _inited = false

  constructor(pluginName, manager, config) {
    this.manager = manager
    this.config = config
    this.name = pluginName
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if ({}.hasOwnProperty.call(exports, prop)) {
          return exports?.[prop]
        }
        return Reflect.get(target, prop, receiver)
      }
    })
  }

  async init() {
    if (this._inited) {
      return
    }
    await this.config.init?.call(undefined)
    this._inited = true
  }
}