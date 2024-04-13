export default {
  name: 'LeftArea',
  props: {
    area: Object,
    className: {
      type: String,
      default: () => 'lc-left-area'
    }
  },
  render() {
    const { className, area } = this
    if (area.isEmpty()) {
      return
    }
    const top = []
    const bottom = []
    area.container.items.slice().sort((a, b) => {
      const index1 = a.config?.index || 0
      const index2 = b.config?.index || 0
      return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1)
    }).forEach((item) => {
      const content = <div key={`left-area-${item.name}`}>{item.content}</div>
      if (item.align === 'bottom') {
        bottom.push(content)
      } else {
        top.push(content)
      }
    })
    return (
      <div class={{ 'lc-area-visible': area.visible, [className]: true }}>
        <div class="lc-left-area-top">{top}</div>
        <div class="lc-left-area-bottom">{bottom}</div>
      </div>
    )
  }
}