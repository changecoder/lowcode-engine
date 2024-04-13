import { EventEmitter } from 'events'

export class Editor extends EventEmitter {
  context = new Map()

  get(keyOrType) {
    return this.context.get(keyOrType)
  }
}