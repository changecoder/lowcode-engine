import EventEmitter from 'events'
import { IPublicApiEvent } from '@cc/lowcode-types'

export interface IEventBus extends IPublicApiEvent {
  removeListener(event: string | symbol, listener: (...args: any[]) => void): any
  addListener(event: string | symbol, listener: (...args: any[]) => void): any
  setMaxListeners(n: number): any
  removeAllListeners(event?: string | symbol): any
}

export class EventBus implements IEventBus {
  private readonly eventEmitter: EventEmitter
  private readonly name?: string

  /**
   * 内核触发的事件名
   */
  readonly names = []

  constructor(emitter: EventEmitter, name?: string) {
    this.eventEmitter = emitter
    this.name = name
  }

  /**
   * 监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event: string, listener: (...args: any[]) => void): () => void {
    this.eventEmitter.on(event, listener)
    return () => {
      this.off(event, listener)
    }
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event: string, listener: (...args: any[]) => void) {
    this.eventEmitter.off(event, listener)
  }

  prependListener(event: string, listener: (...args: any[]) => void): () => void {
    this.eventEmitter.prependListener(event, listener)
    return () => {
      this.off(event, listener)
    }
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event: string, ...args: any[]) {
    this.eventEmitter.emit(event, ...args)
  }

  removeListener(event: string | symbol, listener: (...args: any[]) => void): any {
    return this.eventEmitter.removeListener(event, listener)
  }

  addListener(event: string | symbol, listener: (...args: any[]) => void): any {
    return this.eventEmitter.addListener(event, listener)
  }

  setMaxListeners(n: number): any {
    return this.eventEmitter.setMaxListeners(n)
  }
  removeAllListeners(event?: string | symbol): any {
    return this.eventEmitter.removeAllListeners(event)
  }
}

export const createModuleEventBus = (moduleName: string, maxListeners?: number): IEventBus => {
  const emitter = new EventEmitter();
  if (maxListeners) {
    emitter.setMaxListeners(maxListeners)
  }
  return new EventBus(emitter, moduleName)
}