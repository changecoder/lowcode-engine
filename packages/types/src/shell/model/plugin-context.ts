import { IPluginPreferenceMananger } from '../../module';
import { IPublicApiSkeleton } from '../api';

export interface IPublicModelPluginContext {
  /**
   * 可通过该对象读取插件初始化配置
   */
  preference: IPluginPreferenceMananger;
  get skeleton(): IPublicApiSkeleton;
}
