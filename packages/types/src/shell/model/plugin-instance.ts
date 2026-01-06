import { IPublicTypePluginMeta } from '../type';

export interface IPublicModelPluginInstance {
  disabled: boolean;
  get pluginName(): string;
  /**
   * 依赖信息，依赖的其他插件
   */
  get dep(): string[];
  /**
   * 插件配置元数据
   */
  get meta(): IPublicTypePluginMeta;
}
