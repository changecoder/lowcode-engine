import { simulatorHostSymbol } from '../symbols'

export class SimulatorHost {
  constructor(simulator) {
    this[simulatorHostSymbol] = simulator
  }

  static create(host) {
    if (!host) {
      return null
    }
    return new SimulatorHost(host)
  }

  /**
   * 设置 host 配置值
   * @param key
   * @param value
   */
  set(key, value) {
    this[simulatorHostSymbol].set(key, value)
  }

  /**
   * 获取 host 配置值
   * @param key
   * @returns
   */
  get(key) {
    return this[simulatorHostSymbol].get(key)
  }
}