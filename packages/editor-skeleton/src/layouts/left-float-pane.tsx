import { type PropType, defineComponent } from 'vue'
import { Area } from '../area'

export default defineComponent({
  name: 'LeftArea',
  props: {
    area: {
      type: Object as PropType<Area>,
      required: true
    }
  },
  render() {
    const { area } = this
    return   <div class={['lc-left-float-pane', area.visible ? 'lc-area-visible' : '']}>
      { area.container.items.map(item => item.content) }
    </div>
  }
})