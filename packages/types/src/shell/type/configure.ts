import { IPublicTypeAdvanced, IPublicTypeFieldConfig } from '.';
import { ConfigureSupport, IPublicTypeComponentConfigure } from './metadata';
/**
 * 编辑体验配置
 */
export interface IPublicTypeConfigure {
  /**
   * 属性面板配置
   */
  props?: IPublicTypeFieldConfig[];

  /**
   * 组件能力配置
   */
  component?: IPublicTypeComponentConfigure;

  /**
   * 通用扩展面板支持性配置
   */
  supports?: ConfigureSupport;

  /**
   * 高级特性配置
   */
  advanced?: IPublicTypeAdvanced;
}
