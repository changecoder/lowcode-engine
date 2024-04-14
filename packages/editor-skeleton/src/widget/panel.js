import { h } from 'vue'

export class Panel {
  isWidget = true
  isPanel = true
  _actived = false

  get visible() {
    if (!this.parent || this.parent.visible) {
      const { props } = this.config
      if (props?.condition) {
        return props.condition(this)
      }
      return this._actived
    }
    return false
  }

  get content() {
    const { content, contentProps = {} } = this.config
    return h(content, { ...contentProps, editor: this.skeleton.editor })
  }

  get editor() {
    return this.skeleton.editor
  }

  constructor(skeleton, config) {
    const { content, name, props = {}} = config
    this.skeleton = skeleton
    this.name = name
    this.panelName = config.panelName || name
    this.config = config
    this.align = props.align
    if (Array.isArray(content)) {
      this.container = this.skeleton.createContainer(
        name,
        (item) => {
          if (isPanel(item)) {
            return item
          }
          return this.skeleton.createPanel(item)
        },
        true,
        () => this.visible,
        true
      )
      content.forEach((item) => this.add(item))
    }
  }

  setParent(parent) {
    if (parent === this.parent) {
      return
    }
    if (this.parent) {
      this.parent.remove(this)
    }
    this.parent = parent
  }

  add(item) {
    return this.container?.add(item)
  }
}

export function isPanel(obj) {
  return obj && obj.isPanel
}
