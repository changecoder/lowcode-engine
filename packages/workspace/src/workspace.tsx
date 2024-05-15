import { defineComponent, provide } from 'vue'
import { SimulatorHost } from "@cc/lowcode-vue-simulator"

const host = new SimulatorHost()
import SimulatorView from './components/simulator-view'
import './components/simulator-view.less'

export default defineComponent({
  name: 'Workspace',
  setup() {
    provide('host', host)
    return () => <div class="engine-workspace">
      <div class="workspace-top-area">top area</div>
      <div class="workspace-center-area">
        <div class="workspace-left-area">left area</div>
        <div class="workspace-main-area">
          <SimulatorView />
        </div>
        <div class="workspace-right-area">right area</div>
      </div>
    </div>
  }
})