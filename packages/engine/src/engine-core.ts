import { createApp } from 'vue'
import ElementPlus from 'element-plus'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {
  Skeleton as InnerSkeleton,
  Workbench
} from '@cc/lowcode-editor-skeleton'
import {
  Skeleton,
  Plugins,
  Material,
  Project
} from '@cc/lowcode-shell'
import {
  Designer,
  LowCodePluginManager
} from '@cc/lowcode-designer'
import {
  Editor,
  IEditor
} from '@cc/lowcode-editor-core'
import { IPublicTypeDisposable, IPublicApiPlugins } from '@cc/lowcode-types'
import { defaultPanelRegistry } from './inner-plugins/default-panel-registry'

async function registryInnerPlugin(editor: IEditor, plugins: IPublicApiPlugins): Promise<IPublicTypeDisposable> {
  // 注册一批内置插件
  const defaultPanelRegistryPlugin = defaultPanelRegistry(editor)
  await plugins.register(defaultPanelRegistryPlugin)
  return () => {
    plugins.delete(defaultPanelRegistryPlugin.pluginName)
  }
}

// @ts-ignore Define variable
export const version = VERSION_PLACEHOLDER

const editor = new Editor()
const material = new Material(editor)
const designer = new Designer({ editor })
editor.set('designer', designer)
const { project: innerProject } = designer
const project = new Project(innerProject)
const innerSkeleton = new InnerSkeleton(editor)
editor.set('skeleton', innerSkeleton)

const pluginContextApiAssembler = {
  assembleApis: (context: any, pluginName: string) => {
    context.skeleton = new Skeleton(innerSkeleton, pluginName)
    context.material = material
    context.project = project
  }
}
const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler)
const plugins = new Plugins(innerPlugins)
editor.set('innerPlugins', innerPlugins)

export {
  plugins
}

registryInnerPlugin(editor, plugins)

export async function init(container?: HTMLElement) {
  let engineContainer = container
  if (!engineContainer) {
    engineContainer = document.createElement('div')
    engineContainer.id = 'engine'
    document.body.appendChild(engineContainer)
  } 

  await plugins.init()
  
  const app = createApp(Workbench, {
    skeleton: innerSkeleton,
    className: 'engine-main',
    topAreaItemClassName: 'engine-actionitem'
  })
  
  app.use(ElementPlus)

  for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component as any)
  }

  app.mount(engineContainer)
}
