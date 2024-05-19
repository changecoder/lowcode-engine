import { IPublicApiSkeleton, IPublicApiMaterial, IPublicApiProject,  } from '../api'

export interface IPublicModelPluginContext {
  get skeleton(): IPublicApiSkeleton

  get material(): IPublicApiMaterial

  get project(): IPublicApiProject
}