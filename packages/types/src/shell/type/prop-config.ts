export interface IPublicTypePropConfig {
  /**
   * 属性名称
   */
  name: string;
  /**
   * 属性描述
   */
  description?: string;
  /**
   * 属性默认值
   */
  defaultValue?: any;
  /**
   * @deprecated 已被弃用
   */
  setter?: any;
}
