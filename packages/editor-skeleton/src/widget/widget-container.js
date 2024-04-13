export class WidgetContainer {
  items = []
  maps = {}

  constructor(name, handle) {
    this.name = name
    this.handle = handle
  }

  get(name) {
    return this.maps[name] || null
  }

  add(item) {
    const newItem = this.handle(item)
    const origin = this.get(newItem.name)
    if (origin === newItem) {
      return origin
    }
    const i = origin ? this.items.indexOf(origin) : -1
    if (i > -1) {
      this.items[i] = newItem
    } else {
      this.items.push(newItem)
    }
    this.maps[newItem.name] = newItem
    return newItem
  }
}