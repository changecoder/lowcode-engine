export class Area {
  _visible = true

  get visible() {
    return this._visible
  }

  constructor(skeleton, name, handle, exclusive) {
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
}