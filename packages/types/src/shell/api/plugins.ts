import { IPublicTypePlugin } from '../type'

export interface IPublicApiPlugins {
  /**
   * 可以通过 plugin api 获取其他插件 export 导出的内容
   */
  [key: string]: any

  register(
    pluginModel: IPublicTypePlugin
  ): Promise<void>
}