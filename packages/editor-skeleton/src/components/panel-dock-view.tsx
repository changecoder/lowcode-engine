import { defineComponent, type PropType, h, resolveComponent } from 'vue'

export const PanelDockView = defineComponent({
  name: 'Panel-Dock-View',
  props: {
    className: String,
    handleClick: Function as PropType<(payload: MouseEvent) => void>,
    icon: {
      type: String,
      default: () => 'Wallet'
    }
  },
  render() {
    const { className, handleClick, icon } = this
    return <span
      class={['lc-title', className]}
      onClick={handleClick}
    >
      <b class="lc-title-icon">
        {h(resolveComponent(icon))}
      </b>
  </span>
  }
})