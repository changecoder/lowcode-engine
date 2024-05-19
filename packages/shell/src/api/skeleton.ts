import { IPublicApiSkeleton, IPublicModelSkeletonItem, IPublicTypeSkeletonConfig } from '@cc/lowcode-types'
import {
  ISkeleton
} from '@cc/lowcode-editor-skeleton'
import { skeletonSymbol } from '../symbols'
import { SkeletonItem } from '../model'
const innerSkeletonSymbol = Symbol('skeleton')

export class Skeleton implements IPublicApiSkeleton {
  private readonly [innerSkeletonSymbol]: ISkeleton
  private readonly pluginName: string

  get [skeletonSymbol](): ISkeleton {
    return this[innerSkeletonSymbol]
  }

  constructor(
    skeleton: ISkeleton,
    pluginName: string
  ) {
    this[innerSkeletonSymbol] = skeleton
    this.pluginName = pluginName
  }

  /**
   * 增加一个面板实例
   * @param config
   * @param extraConfig
   * @returns
   */
  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): IPublicModelSkeletonItem | undefined {
    const configWithName = {
      ...config,
      pluginName: this.pluginName
    }
    const item = this[skeletonSymbol].add(configWithName, extraConfig);
    if (item) {
      return new SkeletonItem(item)
    }
  }
}