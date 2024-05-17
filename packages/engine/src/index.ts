import { createApp } from 'vue'

import { Workspace } from '@cc/lowcode-workspace'
import { Material } from '@cc/lowcode-shell'
import { Editor } from '@cc/lowcode-editor-core'
import { Designer } from '@cc/lowcode-designer'

const editor = new Editor()
const designer = new Designer({ editor })
editor.set('designer' as any, designer)
const material = new Material(editor)

material.onChangeAssets(() => {
  const assets = material.getAssets()
  const { components = [] } = assets
  designer.buildComponentMetasMap(components)
})

export const init = (container: HTMLElement) => {
  const app = createApp(Workspace, {})
  app.mount(container)
}

export {
  material
}