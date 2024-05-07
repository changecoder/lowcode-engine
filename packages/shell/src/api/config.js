import { configSymbol } from '../symbols'

export class Config {
  constructor(innerEngineConfig) {
    this[configSymbol] = innerEngineConfig
  }

  has(key) {
    return this[configSymbol].has(key)
  }

  get(key, defaultValue) {
    return this[configSymbol].get(key, defaultValue)
  }

  set(key, value) {
    this[configSymbol].set(key, value)
  }

  setConfig(config) {
    this[configSymbol].setConfig(config)
  }

  onceGot(key) {
    return this[configSymbol].onceGot(key)
  }

  onGot(key, fn) {
    return this[configSymbol].onGot(key, fn)
  }

  getPreference() {
    return this[configSymbol].getPreference()
  }
}