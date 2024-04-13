import { h } from 'vue'

import WidgetView from '../components/widget-views/widget-view'

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
    this._body = h(content, { ...contentProps, editor: this.skeleton.editor })
    return this._body
  }

  get content() {
    return h(WidgetView, {
      widget: this
    })
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