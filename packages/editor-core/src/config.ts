import { IPublicModelEngineConfig } from '@cc/lowcode-types'

export interface IEngineConfig extends IPublicModelEngineConfig {
  notifyGot(key: string): void
}

export class EngineConfig {
  private config: { [key: string]: any } = {}
  private waits = new Map<
    string,
    Array<{
      once?: boolean
      resolve: (data: any) => void
    }>
  >()

  constructor(config?: { [key: string]: any }) {
    this.config = config || {}
  }

  /**
   * 判断指定 key 是否有值
   * @param key
   */
  has(key: string): boolean {
    return this.config[key] !== undefined
  }

  /**
   * 获取指定 key 的值
   * @param key
   * @param defaultValue
   */
  get(key: string, defaultValue?: any): any {
    return this.config[key] || defaultValue
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.config[key] = value;
    this.notifyGot(key);
  }

  /**
   * 批量设值，set 的对象版本
   * @param config
   */
  setConfig(config: { [key: string]: any }) {
    if (config) {
      Object.keys(config).forEach((key) => {
        this.set(key, config[key]);
      });
    }
  }

  notifyGot(key: string): void {
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