export interface IPublicModelEngineConfig {

  /**
   * 判断指定 key 是否有值
   * check if config has certain key configed
   * @param key
   * @returns
   */
  has(key: string): boolean

  /**
   * 获取指定 key 的值
   * get value by key
   * @param key
   * @param defaultValue
   * @returns
   */
  get(key: string, defaultValue?: any): any

  /**
   * 设置指定 key 的值
   * set value for certain key
   * @param key
   * @param value
   */
  set(key: string, value: any): void

  /**
   * 批量设值，set 的对象版本
   * set multiple config key-values
   * @param config
   */
  setConfig(config: { [key: string]: any }): void
}