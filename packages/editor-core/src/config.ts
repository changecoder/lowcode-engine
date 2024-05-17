export class EngineConfig {
  private config: { [key: string]: any } = {}

  get(key: string, defaultValue?: any): any {
    return this.config[key] || defaultValue
  }

  /**
   * 设置指定 key 的值
   * @param key
   * @param value
   */
  set(key: string, value: any) {
    this.config[key] = value
  }
}

export const engineConfig = new EngineConfig()