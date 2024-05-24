import { IPublicTypePlugin } from '@cc/lowcode-types'

export interface ILowCodePluginManagerCore {
  register(
    pluginModel: IPublicTypePlugin,
    pluginOptions?: any
  ): void
  init(): Promise<void>
}

export interface ILowCodePluginContextApiAssembler {
  assembleApis(
    context: any,
    pluginName: string
  ): void
}

export type ILowCodePluginManager = ILowCodePluginManagerCore