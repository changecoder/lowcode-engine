import { ref } from 'vue'
import { IPublicTypeWidgetBaseConfig } from '@cc/lowcode-types'
import { IWidget, WidgetContainer } from './widget'
import { ISkeleton } from './skeleton'

export interface IArea<C, T> {
  add(config: T | C): T
}

export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget> implements IArea<C, T> {
  _visible = ref(true)

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
    return null;
  }
  readonly container: WidgetContainer<T, C>

  constructor(readonly skeleton: ISkeleton, readonly name: string, handle: (item: T | C) => T, private exclusive?: boolean) {
    this.skeleton = skeleton
    this.exclusive = exclusive
    this.container = skeleton.createContainer(name, handle, exclusive)
  }
  
  add(config: T | C): T {
    const item = this.container.get(config.name)
    if (item) {
      console.warn(`The ${config.name} has already been added to skeleton.`)
      return item
    }
    return this.container.add(config)
  }
}