import { defineComponent, type PropType } from 'vue'
import { DesignerView } from '@cc/lowcode-designer'
import { Editor } from '@cc/lowcode-editor-core'

import './index.less'

export default defineComponent({
  name: 'DesignerPlugin',
  props: {
    engineConfig: Object,
    engineEditor: Object as PropType<Editor>
  },
  async setup(props: any) {
    const editor = props.engineEditor
    try {
      const assets = await editor.onceGot('assets')
      const { components, packages, extraEnvironment, utils } = assets
      return {
        componentMetadatas: components || [],
        library: packages || [],
        utilsMetadata: utils || [],
        extraEnvironment
      }
    } catch(e) {
      return {
        componentMetadatas: [],
        library: [],
        utilsMetadata: []
      }
    }
  },
  render() {
    const { engineEditor: editor, library } = this
    return <DesignerView 
      designer={editor!.get('designer')}
      class="lowcode-plugin-designer"
      simulatorProps={{
        library
      }}
    />
  }
})