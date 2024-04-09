import { h } from 'vue'
import { skeletonCabinSymbol, skeletonSymbol } from '../symbols'
import {
  Skeleton as InnerSkeleton,
  Workbench as InnerWorkbench
} from '@cc/lowcode-editor-skeleton'

class SkeletonCabin {
  constructor(skeleton) {
    this[skeletonSymbol] = skeleton
    this[skeletonCabinSymbol] = {
      Workbench: InnerWorkbench,
      Skeleton: InnerSkeleton
    }
  }

  get Workbench() {
    const innerSkeleton = this[skeletonSymbol]
    return (props) => h(InnerWorkbench, { ...props, skeleton: innerSkeleton })
  }
}

export class Common {
  __skeletonCabin = undefined
  editor = undefined

  constructor(editor, skeleton) {
    this.editor = editor
    this.__skeletonCabin = new SkeletonCabin(skeleton)
  }

  get skeletonCabin() {
    return this.__skeletonCabin
  }
}