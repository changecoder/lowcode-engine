import { IPublicTypeWidgetBaseConfig } from '@cc/lowcode-types'
import { IWidget, WidgetContainer } from './widget'
import { ISkeleton } from './skeleton'

export interface IArea<C, T> {
  add(config: T | C): T
}

export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget> implements IArea<C, T> {
  readonly container: WidgetContainer<T, C>
  
  constructor(readonly skeleton: ISkeleton, readonly name: string, handle: (item: T | C) => T) {
    this.skeleton = skeleton
    this.container = skeleton.createContainer(name, handle)
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