import { shallowRef, shallowReactive } from 'vue'
import { isPanel } from './panel'

function isActiveable(obj) {
  return obj && obj.setActive
}

export class WidgetContainer {
  items = []
  maps = {}
  _current = null

  get visible() {
    return this.checkVisible()
  }

  get current() {
    return this._current
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

  active(nameOrItem) {
    let item = nameOrItem;
    if (nameOrItem && typeof nameOrItem === 'string') {
      item = this.get(nameOrItem)
    }
    if (!isActiveable(item)) {
      item = null
    }

    if (this.exclusive) {
      if (this._current === item) {
        return
      }
      if (this._current) {
        this._current.setActive(false)
      }
      this._current = item
    }

    if (item) {
      item.setActive(true)
    }
  }

  unactive(nameOrItem) {
    let item = nameOrItem
    if (nameOrItem && typeof nameOrItem === 'string') {
      item = this.get(nameOrItem)
    }
    if (!isActiveable(item)) {
      item = null
    }
    if (this._current === item) {
      this._current = null
    }
    if (item) {
      item.setActive(false)
    }
  }

  unactiveAll() {
    Object.keys(this.maps).forEach((name) => this.unactive(name))
  }

  get(name) {
    return this.maps[name] || null
  }

  getAt(index) {
    return this.items[index] || null
  }

  add(item) {
    const newItem = shallowReactive(this.handle(item))
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