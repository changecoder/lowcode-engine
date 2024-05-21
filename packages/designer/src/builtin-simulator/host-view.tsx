import { defineComponent, ref } from 'vue'
import { BuiltinSimulatorHost } from './host'
import './host.less'

export const BuiltinSimulatorHostView = defineComponent({
  name: 'BuiltinSimulatorHostView',
  props: {
    project: Object
  },
  setup(props: any) {
    const { project, designer } = props
    const host = ref(project.simulator || new BuiltinSimulatorHost(project, designer))
    props.onMount?.(host.value)

    return {
      host
    }
  },
  render() {
    return <div class="lc-simulator">
      <div class="lc-simulator-canvas lc-simulator-device-default">
        <div class="lc-simulator-content">
          <iframe
            class="lc-simulator-content-frame"
            ref={(frame) => 
              setTimeout(() => {
                this.host.mountContentFrame(frame)
              })}
          />
        </div>
      </div>
    </div>
  }
})