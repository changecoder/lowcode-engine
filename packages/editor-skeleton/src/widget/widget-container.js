import { isPanel } from './panel'

export class WidgetContainer {
  items = []
  maps = {}

  get visible() {
    return this.checkVisible()
  }

  constructor(
    name,
    handle,
    exclusive = false,
    checkVisible = () => true
  ) {
    this.name = name
    this.handle = handle
    this.exclusive = exclusive
    this.checkVisible = checkVisible
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
    if (isPanel(newItem)) {
      newItem.setParent(this)
    }
    return newItem
  }
}