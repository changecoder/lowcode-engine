import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'

import {
  globalContext,
  Editor,
  engineConfig
} from '@cc/lowcode-editor-core'
import {
  Workspace as InnerWorkspace
} from '@cc/lowcode-workspace'
import {
  Project,
  Material,
  Plugins,
  Common,
  Skeleton,
  Config
} from '@cc/lowcode-shell'
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

const innerWorkspace = new InnerWorkspace(registryInnerPlugin)
globalContext.register(innerWorkspace, 'workspace')

export const version = VERSION_PLACEHOLDER

let engineContainer

const editor = new Editor()
globalContext.register(editor, 'editor')

const material = new Material(editor)
editor.set('material', material)

const innerSkeleton = new InnerSkeleton(editor)
editor.set('skeleton', innerSkeleton)

const designer = new Designer({ editor })
editor.set('designer', designer)

const { project: innerProject } = designer

const project = new Project(innerProject)
editor.set('project', project)

const skeleton = new Skeleton(innerSkeleton, 'any')
const config = new Config(engineConfig)
const common = new Common(editor, innerSkeleton)

const pluginContextApiAssembler = {
  assembleApis: (context, pluginName) => {
    context.project = project
    context.skeleton = new Skeleton(innerSkeleton, pluginName)
    context.material = material
    context.config = config
    context.common = common
    editor.set('pluginContext', context)
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