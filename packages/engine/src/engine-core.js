import { render } from 'vue'

import {
  Editor
} from '@cc/lowcode-editor-core'
import { Common } from '@cc/lowcode-shell'
import {
  Skeleton as InnerSkeleton
} from '@cc/lowcode-editor-skeleton'

export const version = VERSION_PLACEHOLDER

let engineContainer

const editor = new Editor()

const innerSkeleton = new InnerSkeleton(editor)

const common = new Common(editor, innerSkeleton)

export const init = async (container) => {
  if (container) {
    engineContainer = container
  } else {
    engineContainer = document.createElement('div')
    engineContainer.id = 'engine'
    document.body.appendChild(engineContainer)
  }
  const { Workbench } = common.skeletonCabin

  render(Workbench({
    skeleton: innerSkeleton,
    className: 'engine-main'
  }), engineContainer)
}