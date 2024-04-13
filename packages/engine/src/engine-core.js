import { render } from 'vue'

import {
  Editor
} from '@cc/lowcode-editor-core'
import { Plugins, Common, Skeleton } from '@cc/lowcode-shell'
import {
  Skeleton as InnerSkeleton
} from '@cc/lowcode-editor-skeleton'
import { LowcodePluginManager } from '@cc/lowcode-designer'

export const version = VERSION_PLACEHOLDER

let engineContainer

const editor = new Editor()

const innerSkeleton = new InnerSkeleton(editor)

const skeleton = new Skeleton(innerSkeleton, 'any')

const common = new Common(editor, innerSkeleton)

const pluginContextApiAssembler = {
  assembleApis: (context, pluginName) => {
    context.skeleton = new Skeleton(innerSkeleton, pluginName)
  }
}

const innerPlugins = new LowcodePluginManager(pluginContextApiAssembler)
const plugins = new Plugins(innerPlugins).toProxy()

export {
  skeleton,
  plugins
}

export const init = async (container) => {
  if (container) {
    engineContainer = container
  } else {
    engineContainer = document.createElement('div')
    engineContainer.id = 'engine'
    document.body.appendChild(engineContainer)
  }
  const { Workbench } = common.skeletonCabin

  await plugins.init()
  
  render(Workbench({
    skeleton: innerSkeleton,
    className: 'engine-main'
  }), engineContainer)
}