import { defineComponent, type PropType } from 'vue'
import { Designer } from '../designer'
import { BuiltinSimulatorHostView } from '../builtin-simulator'

import './project.less'

export const ProjectView = defineComponent({
  name: 'ProjectView',
  props: {
    designer: {
      type: Object as PropType<Designer>,
      require: true
    }
  },
  render() {
    const { projectSimulatorProps: simulatorProps } = this.designer as Designer
    const Simulator = this.designer?.simulatorComponent || BuiltinSimulatorHostView
    return <div class="lc-project">
      <div class="lc-simulator-shell">
        <Simulator {...simulatorProps} />
      </div>
    </div>
  }
})