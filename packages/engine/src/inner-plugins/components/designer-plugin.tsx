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
  render() {
    const editor = this.engineEditor as Editor
    return <DesignerView 
      designer={editor.get('designer')}
      class="lowcode-plugin-designer"
      simulatorProps={{}}
    />
  }
})