import { IPublicApiMaterial, IPublicApiProject, IPublicApiSkeleton, IPublicModelPluginContext } from '@cc/lowcode-types'
import { ILowCodePluginContextApiAssembler } from '.'

export default class PluginContext implements IPublicModelPluginContext {
  skeleton: IPublicApiSkeleton
  material: IPublicApiMaterial
  project: IPublicApiProject

  constructor(
    options: any,
    contextApiAssembler: ILowCodePluginContextApiAssembler
  ) {
    const { pluginName = 'anonymous' } = options
    contextApiAssembler.assembleApis(this, pluginName)
  }
}