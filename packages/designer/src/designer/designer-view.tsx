import { defineComponent, type PropType, ref } from 'vue'
import { ProjectView } from '../project'
import { Designer, DesignerProps } from './designer'

export const DesignerView = defineComponent({
  name: 'DesignerView',
  props: {
    className: String,
    designer: Object as PropType<Designer>,
    simulatorProps: Object
  },
  setup(props: any) {
    const designerRef = ref<Designer>()
    const { designer, ...designerProps } = props
    if (designer) {
      designerRef.value = designer
      designerRef.value?.setProps(designerProps as DesignerProps)
    } else {
      designerRef.value = new Designer(designerProps as DesignerProps)
    }
    return {
      designerRef
    }
  },
  render() {
    const { className, designerRef } = this
    return <div class={['lc-designer', className]}>
      <ProjectView 
        designer={designerRef}
      />
    </div>
  }
})