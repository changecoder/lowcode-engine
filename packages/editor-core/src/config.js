import { get as lodashGet } from 'lodash'

export class EngineConfig {
  waits = new Map()

  constructor(config) {
    this.config = config || {}
  }

  get(key, defaultValue) {
    return lodashGet(this.config, key, defaultValue)
  }
  
  set(key, value) {
    this.config[key] = value
    this.notifyGot(key)
  }

  /**
   * 获取指定 key 的值，若此时还未赋值，则等待，若已有值，则直接返回值
   *  注：此函数返回 Promise 实例，只会执行（fullfill）一次
   * @param key
   * @returns
   */
  onceGot(key) {
    const val = this.config[key]
    if (val !== undefined) {
      return Promise.resolve(val)
    }
    return new Promise((resolve) => {
      this.setWait(key, resolve, true)
    })
  }

  /**
   * 获取指定 key 的值，函数回调模式，若多次被赋值，回调会被多次调用
   * @param key
   * @param fn
   * @returns
   */
  onGot(key, fn) {
    const val = this.config?.[key]
    if (val !== undefined) {
      fn(val)
    }
    this.setWait(key, fn)
    return () => {
      this.delWait(key, fn)
    };
  }

  setWait(key, resolve, once) {
    const waits = this.waits.get(key)
    if (waits) {
      waits.push({ resolve, once })
    } else {
      this.waits.set(key, [{ resolve, once }])
    }
  }

  delWait(key, fn) {
    const waits = this.waits.get(key)
    if (!waits) {
      return
    }
    let i = waits.length
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1)
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key)
    }
  }

  notifyGot(key) {
    let waits = this.waits.get(key)
    if (!waits) {
      return
    }
    waits = waits.slice().reverse()
    let i = waits.length
    while (i--) {
      waits[i].resolve(this.get(key))
      if (waits[i].once) {
        waits.splice(i, 1)
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits)
    } else {
      this.waits.delete(key)
    }
  }

}

export const engineConfig = new EngineConfig()