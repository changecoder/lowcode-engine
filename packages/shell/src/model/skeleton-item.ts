import { IPublicModelSkeletonItem } from '@cc/lowcode-types'
import { skeletonItemSymbol } from '../symbols'

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: any

  get name() {
    return this[skeletonItemSymbol].name
  }

  constructor(skeletonItem: any) {
    this[skeletonItemSymbol] = skeletonItem
  }
}