import { IEngineConfig } from '@cc/lowcode-editor-core'
import { configSymbol } from '../symbols'

export class Config {
  private readonly [configSymbol]: IEngineConfig

  constructor(innerEngineConfig: IEngineConfig) {
    this[configSymbol] = innerEngineConfig
  }

  has(key: string): boolean {
    return this[configSymbol].has(key)
  }

  get(key: string, defaultValue?: any): any {
    return this[configSymbol].get(key, defaultValue)
  }

  set(key: string, value: any): void {
    this[configSymbol].set(key, value)
  }

  setConfig(config: { [key: string]: any }): void {
    this[configSymbol].setConfig(config)
  }
}