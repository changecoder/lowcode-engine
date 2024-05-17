import EventEmitter from 'events'

export class EventBus {
  private readonly eventEmitter: EventEmitter
  private readonly name?: string

  constructor(emitter: EventEmitter, name?: string) {
    this.eventEmitter = emitter
    this.name = name
  }

  on(event: string, listener: (...args: any[]) => void): () => void {
    this.eventEmitter.on(event, listener)
    return () => {
      this.off(event, listener)
    };
  }

  off(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener)
  }

  emit(event: string, ...args: any[]) {
    this.eventEmitter.emit(event, ...args)
  }
}