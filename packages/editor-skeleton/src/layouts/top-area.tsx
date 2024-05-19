import { defineComponent } from 'vue'

export default defineComponent({
  name: 'TopArea',
  props: {
    itemClassName: String
  },
  render() {
    return <div class={['lc-top-area', 'engine-actionpane', 'lc-area-visible']}>
      <div class="lc-top-area-left">left</div>
      <div class="lc-top-area-center">center</div>
      <div class="lc-top-area-right">right</div>
    </div>
  }
})