import { defineComponent, type PropType } from 'vue'
import { Area } from '../area'

export default defineComponent({
  name: 'MainArea',
  props: {
    area: {
      type: Object as PropType<Area>,
      required: true
    }
  },
  render() {
    return <div class="lc-main-area engine-workspacepane">
      {this.area.container.items.map((item) => item.content)}
    </div>
  }
})