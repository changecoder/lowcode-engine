import EventEmitter from 'events'
import { Logger } from '@cc/lowcode-utils'

const logger = new Logger({ level: 'warn', bizName: 'event-bus' })
const moduleLogger = new Logger({ level: 'warn', bizName: 'module-event-bus' })

export class EventBus {
  /**
   * 内核触发的事件名
   */
  names = []

  constructor(emitter, name) {
    this.eventEmitter = emitter
    this.name = name
  }

  getMsgPrefix(type) {
    if (this.name && this.name.length > 0) {
      return `[${this.name}][event-${type}]`
    } else {
      return `[*][event-${type}]`
    }
  }

  getLogger() {
    if (this.name && this.name.length > 0) {
      return moduleLogger
    } else {
      return logger
    }
  }

  /**
   * 监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  on(event, listener) {
    this.eventEmitter.on(event, listener)
    this.getLogger().debug(`${this.getMsgPrefix('on')} ${event}`)
    return () => {
      this.off(event, listener)
    }
  }

  /**
   * 取消监听事件
   * @param event 事件名称
   * @param listener 事件回调
   */
  off(event, listener) {
    this.eventEmitter.off(event, listener)
    this.getLogger().debug(`${this.getMsgPrefix('off')} ${event}`)
  }

  /**
   * 触发事件
   * @param event 事件名称
   * @param args 事件参数
   * @returns
   */
  emit(event, ...args) {
    this.eventEmitter.emit(event, ...args)
    this.getLogger().debug(`${this.getMsgPrefix('emit')} name: ${event}, args: `, ...args)
  }

  removeListener(event, listener) {
    return this.eventEmitter.removeListener(event, listener)
  }

  addListener(event, listener) {
    return this.eventEmitter.addListener(event, listener)
  }

  setMaxListeners(n) {
    return this.eventEmitter.setMaxListeners(n)
  }

  removeAllListeners(event) {
    return this.eventEmitter.removeAllListeners(event)
  }
}

export const createModuleEventBus = (moduleName, maxListeners) => {
  const emitter = new EventEmitter()
  if (maxListeners) {
    emitter.setMaxListeners(maxListeners)
  }
  return new EventBus(emitter, moduleName)
}