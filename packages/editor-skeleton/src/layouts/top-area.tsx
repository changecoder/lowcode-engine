import { PropType, defineComponent } from 'vue'
import { Area } from '../area'

export default defineComponent({
  name: 'TopArea',
  props: {
    area: {
      type: Object as PropType<Area>,
      required: true
    },
    itemClassName: String
  },
  render() {
    const { itemClassName, area } = this
    const right: any[] = []
    area.container.items.forEach((item) => {
      const content = <div class={itemClassName || ''} key={`top-area-${item.name}`}>{item.content}</div>
      if (item.align === 'right') {
        right.push(content)
      }
    })
    return <div class={['lc-top-area', 'engine-actionpane', 'lc-area-visible']}>
      <div class="lc-top-area-left">left</div>
      <div class="lc-top-area-center">center</div>
      <div class="lc-top-area-right">{right}</div>
    </div>
  }
})