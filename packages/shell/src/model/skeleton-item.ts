import { IPublicModelSkeletonItem } from '@cc/lowcode-types'
import { skeletonItemSymbol } from '../symbols'

export class SkeletonItem implements IPublicModelSkeletonItem {
  private [skeletonItemSymbol]: any

  get name() {
    return this[skeletonItemSymbol].name
  }

  get visible() {
    return this[skeletonItemSymbol].visible
  }

  constructor(skeletonItem: any) {
    this[skeletonItemSymbol] = skeletonItem
  }

  hide() {
    this[skeletonItemSymbol].hide()
  }

  show() {
    this[skeletonItemSymbol].show()
  }

  toggle() {
    this[skeletonItemSymbol].toggle()
  }
}