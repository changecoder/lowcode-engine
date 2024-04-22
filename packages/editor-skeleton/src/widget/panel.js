import { h } from 'vue'

export class Panel {
  isWidget = true
  isPanel = true
  _actived = false
  inited = false

  get actived() {
    return this._actived
  }

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
    this.config = config
    this.name = name
    this.panelName = config.panelName || name
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

  isChildOfFloatArea() {
    return this.parent?.name === 'leftFloatArea'
  }

  isChildOfFixedArea() {
    return this.parent?.name === 'leftFixedArea'
  }

  setActive(flag) {
    if (flag === this._actived) {
      return
    }
    if (flag) {
      if (this.isChildOfFloatArea()) {
        this.skeleton.leftFixedArea.container.unactiveAll()
      } else if (this.isChildOfFixedArea()) {
        this.skeleton.leftFloatArea.container.unactiveAll()
      }
      this._actived = true
      this.parent?.active(this)
      if (!this.inited) {
        this.inited = true
      }
    } else if (this.inited) {
      if (this.parent?.name && this.name.startsWith(this.parent.name)) {
        this.inited = false
      }
      this._actived = false
      this.parent?.unactive(this)
    }
  }

  toggle() {
    this.setActive(!this._actived)
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