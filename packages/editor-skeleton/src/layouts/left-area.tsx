import { defineComponent, type PropType } from 'vue'
import { Area } from '../area'

export default defineComponent({
  name: 'LeftArea',
  props: {
    area: {
      type: Object as PropType<Area>,
      required: true
    },
    className: {
      type: String,
      default: () => 'lc-left-area'
    }
  },
  render() {
    const { className, area } = this
    const top: any[] = []
    const bottom: any[] = []
    area.container.items.forEach((item) => {
      const content = <div key={`left-area-${item.name}`}>{item.content}</div>
      if (item.align === 'bottom') {
        bottom.push(content)
      } else {
        top.push(content)
      }
    })
    return (
      <div class={["lc-area-visible", className]}>
        <div class="lc-left-area-top">{top}</div>
        <div class="lc-left-area-bottom">{bottom}</div>
      </div>
    )
  }
})