import { defineComponent } from 'vue'

export default defineComponent({
  name: 'DesignerPlugin',
  props: {
    engineConfig: Object,
    engineEditor: Object
  },
  render() {
    return <div>DesignerPlugin</div>
  }
})