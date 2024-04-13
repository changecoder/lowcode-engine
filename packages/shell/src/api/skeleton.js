import { skeletonSymbol } from '../symbols'

export const innerSkeletonSymbol = Symbol('skeleton')

export class Skeleton {
  get [skeletonSymbol]() {
    return this[innerSkeletonSymbol]
  }

  constructor(skeleton, pluginName) {
    this[innerSkeletonSymbol] = skeleton
    this.pluginName = pluginName
  }

  add(config, extraConfig) {
    const configWithName = {
      ...config,
      pluginName: this.pluginName
    }
    this[skeletonSymbol].add(configWithName, extraConfig)
  }
}