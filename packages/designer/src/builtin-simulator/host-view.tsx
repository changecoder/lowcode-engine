import { defineComponent, ref } from 'vue'

export const BuiltinSimulatorHostView = defineComponent({
  name: 'BuiltinSimulatorHostView',
  props: {
    host: Object
  },
  setup() {
    const frameRef = ref()

    return {
      frameRef
    }
  },
  mounted() {
    this.host?.mountContentFrame(this.frameRef.value)
  },
  render() {
    return <div class="lc-simulator-content">
      <iframe
        class="lc-simulator-content-frame"
        ref={this.frameRef}
      />
    </div>
  }
})