import { h } from 'vue'
import { WidgetView } from '../components/widget-views'

export const isWidget = (obj) => obj && obj.isWidget 

export class Widget {
  isWidget = true
  visible = true
  disable = false
  inited = false

  get body() {
    if (this.inited) {
      return this._body
    }
    this.inited = true
    const { content, contentProps } = this.config
    this._body = h(content, {
      ...contentProps,
      config: this.config,
      editor: this.skeleton.editor
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
    const { name, props = {}} = config
    this.skeleton = skeleton
    this.name = name
    this.config = config
    this.align = props.align
    this.title = props.title || name
  }
}