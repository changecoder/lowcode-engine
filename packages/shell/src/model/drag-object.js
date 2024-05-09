import { dragObjectSymbol } from '../symbols'

export class DragObject {
  constructor(dragObject) {
    this[dragObjectSymbol] = dragObject
  }

  static create(dragObject) {
    if (!dragObject) {
      return null
    }
    return new DragObject(dragObject)
  }
}