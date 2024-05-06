import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import {
  Editor
} from '@cc/lowcode-editor-core'
import { Material, Plugins, Common, Skeleton } from '@cc/lowcode-shell'
import {
  Skeleton as InnerSkeleton
} from '@cc/lowcode-editor-skeleton'
import { LowcodePluginManager, Designer } from '@cc/lowcode-designer'

import defaultPanelRegistry from './inner-plugins/default-panel-registry'

async function registryInnerPlugin(designer, editor, plugins) {
  const defaultPanelRegistryPlugin = defaultPanelRegistry(editor)

  await plugins.register(defaultPanelRegistryPlugin)

  return () => {
    plugins.delete(defaultPanelRegistryPlugin.pluginName)
  }
}

export const version = VERSION_PLACEHOLDER

let engineContainer

const editor = new Editor()

const material = new Material(editor)
editor.set('material', material)

const innerSkeleton = new InnerSkeleton(editor)

const skeleton = new Skeleton(innerSkeleton, 'any')

const common = new Common(editor, innerSkeleton)

const pluginContextApiAssembler = {
  assembleApis: (context, pluginName) => {
    context.skeleton = new Skeleton(innerSkeleton, pluginName)
    context.material = material
  }
}

const innerPlugins = new LowcodePluginManager(pluginContextApiAssembler)
const plugins = new Plugins(innerPlugins).toProxy()

editor.set('innerPlugins', innerPlugins)
editor.set('plugins', plugins)

export {
  skeleton,
  plugins
}

const designer = new Designer({ editor })
editor.set('designer', designer)

registryInnerPlugin(designer, editor, plugins)

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
  
  const app = createApp(Workbench, {
    skeleton: innerSkeleton,
    className: 'engine-main',
    topAreaItemClassName: 'engine-actionitem'
  })

  app.use(ElementPlus)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
  }
  
  app.mount(engineContainer)
}