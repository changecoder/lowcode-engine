import { EventEmitter } from 'events'
import { EventBus } from './event-bus'
import { engineConfig } from './config'

export class Editor extends EventEmitter {
  private context = new Map()
  eventBus: EventBus
  
  constructor() {
    super()
    this.eventBus = new EventBus(this)
  }

  get<KeyOrType = any>(
    keyOrType: KeyOrType
  ): any {
    return this.context.get(keyOrType as any)
  }

  set(key: any, data: any): void | Promise<void> {
    engineConfig.set(key as any, data)
    this.context.set(key, data)
  }

  onChange(keyOrType: any): () => void {
    return () => {}
  }
}