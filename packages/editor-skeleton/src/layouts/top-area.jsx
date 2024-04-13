export default {
  name: 'TopArea',
  props: {
    area: Object,
    itemClassName: String,
    className: String
  },
  render() {
    const { className, area, itemClassName } = this
    if (area.isEmpty()) {
      return
    }
    const left = []
    const center = []
    const right = []
    area.container.items.slice().sort((a, b) => {
      const index1 = a.config?.index || 0
      const index2 = b.config?.index || 0
      return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1)
    }).forEach(item => {
      const content = (
        <div class={itemClassName || ''} key={`top-area-${item.name}`}>
          {item.content}
        </div>
      )
      if (item.align === 'center') {
        center.push(content)
      } else if (item.align === 'left') {
        left.push(content)
      } else {
        right.push(content)
      }
    })
    return (
      <div class={{ 'lc-area-visible': area.visible, [className]: true, 'lc-top-area engine-actionpane': true }}>
        <div class="lc-top-area-left">{left}</div>
        <div class="lc-top-area-center">{center}</div>
        <div class="lc-top-area-right">{right}</div>
      </div>
    )
  }
}