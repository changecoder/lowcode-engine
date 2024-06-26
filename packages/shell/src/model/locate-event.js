import { locateEventSymbol } from '../symbols'
import { DragObject } from './drag-object'

export default class LocateEvent {
  constructor(locateEvent) {
    this[locateEventSymbol] = locateEvent
  }

  static create(locateEvent) {
    if (!locateEvent) {
      return null
    }
    return new LocateEvent(locateEvent)
  }

  get type() {
    return this[locateEventSymbol].type
  }

  get globalX() {
    return this[locateEventSymbol].globalX
  }

  get globalY() {
    return this[locateEventSymbol].globalY
  }

  get originalEvent() {
    return this[locateEventSymbol].originalEvent
  }

  get target() {
    return this[locateEventSymbol].target
  }

  get canvasX() {
    return this[locateEventSymbol].canvasX
  }

  get canvasY() {
    return this[locateEventSymbol].canvasY
  }

  get dragObject() {
    return DragObject.create(this[locateEventSymbol].dragObject)
  }
}