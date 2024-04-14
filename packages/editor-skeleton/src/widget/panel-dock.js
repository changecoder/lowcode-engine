import { h } from 'vue'
import { PanelDockView, WidgetView } from '../components/widget-views'

export class PanelDock {
  isWidget = true
  isPanelDock = true
  inited = false
  _visible = true
  _disabled = false

  get visible() {
    return this._visible
  }

  get body() {
    if (this.inited) {
      return this._body
    }
    const { props } = this.config

    this._body = h(PanelDockView, {
      ...props,
      dock: this,
    })

    return this._body
  }

  get content() {
    return h(WidgetView, {
      widget: this
    })
  }

  get contentProps() {
    return this.config.contentProps
  }

  get editor() {
    return this.skeleton.editor
  }

  constructor(skeleton, config) {
    const { content, contentProps, name, props = {}, panelProps} = config
    this.skeleton = skeleton
    this.name = name
    this.panelName = config.panelName || name
    this.config = config
    this.align = props.align
    if (content) {
      const _panelProps = { ...panelProps }
      this._panel = this.skeleton.add({
        type: 'Panel',
        name: this.panelName,
        props: _panelProps,
        contentProps,
        content,
        area: panelProps?.area
      })
    }
  }
}