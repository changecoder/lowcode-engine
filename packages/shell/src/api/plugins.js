import { pluginsSymbol, innerPluginsSymbol } from '../symbols'

export class Plugins {
  get [pluginsSymbol]() {
    return this[innerPluginsSymbol]
  }

  constructor(plugins) {
    this[innerPluginsSymbol] = plugins
  }

  async register(pluginModel) {
    await this[pluginsSymbol].register(pluginModel)
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        const _target = target[pluginsSymbol]
        if (_target.pluginsMap.has(prop)) {
          if (_target.pluginsMap.get(prop)?.disabled) {
            return undefined
          }
          return _target.pluginsMap.get(prop)?.toProxy()
        }
        return Reflect.get(target, prop, receiver)
      }
    })
  }

  async init() {
    await this[pluginsSymbol].init()
  }
}