export class Area {
  _visible = true
  lastCurrent = null

  get visible() {
    if (this.exclusive) {
      return this.container.current != null
    }
    return this._visible
  }

  get current() {
    if (this.exclusive) {
      return this.container.current
    }
    return null
  }

  constructor(skeleton, name, handle, exclusive) {
    this.exclusive = exclusive
    this.container = skeleton.createContainer(name, handle, exclusive, () => this.visible)
  }

  isEmpty() {
    return this.container.items.length < 1
  }

  add(config) {
    const item = this.container.get(config.name)
    if (item) {
      console.warn(`The ${config.name} has already been added to skeleton.`)
      return item
    }
    return this.container.add(config)
  }

  setVisible(flag) {
    if (this.exclusive) {
      const { current } = this.container
      if (flag && !current) {
        this.container.active(this.lastCurrent || this.container.getAt(0))
      } else if (current) {
        this.lastCurrent = current
        this.container.unactive(current)
      }
      return;
    }
    this._visible = flag;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }
}