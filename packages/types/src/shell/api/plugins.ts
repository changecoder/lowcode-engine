import { IPublicModelPluginInstance } from '../model';
import {
  IPublicTypePlugin,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
} from '../type';

export type PluginOptionsType = string | number | boolean | object;

export interface IPublicApiPlugins {
  /**
   * 可以通过 plugin api 获取其他插件 export 导出的内容
   */
  [key: string]: any;
  /**
   * 引擎初始化时可以提供全局配置给到各插件，通过这个方法可以获得本插件对应的配置
   *
   * use this to get preference config for this plugin when engine.init() called
   */
  getPluginPreference(
    pluginName: string
  ): Record<string, IPublicTypePreferenceValueType> | null | undefined;
  register(
    pluginModel: IPublicTypePlugin,
    options?: Record<string, PluginOptionsType>,
    registerOptions?: IPublicTypePluginRegisterOptions
  ): Promise<void>;
  /**
   * 获取指定插件
   */
  get(pluginName: string): IPublicModelPluginInstance | null;
  /**
   * 获取所有的插件实例
   */
  getAll(): IPublicModelPluginInstance[];
  /**
   * 判断是否有指定插件
   */
  has(pluginName: string): boolean;
  /**
   * 删除指定插件
   */
  delete(pluginName: string): void;
}
