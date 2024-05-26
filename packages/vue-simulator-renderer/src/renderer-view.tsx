import { defineComponent } from 'vue'
import LowCodeRenderer from '@cc/lowcode-vue-renderer'

export const SimulatorRendererView = defineComponent({
  props: {
    rendererContainer: Object,
  },
  render() {
    return <LowCodeRenderer />
  }
})