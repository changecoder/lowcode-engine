export default {
  name: 'WidgetView',
  props: {
    widget: Object
  },
  render() {
    if (!this.widget.visible) {
      return
    }
    return (
      <div class={{ 'lc-widget-disabled': this.widget.disabled }}>
        { this.widget.body }
      </div>
    )
  }
}