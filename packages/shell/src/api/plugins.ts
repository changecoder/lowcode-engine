import {
  IPublicApiPlugins,
  IPublicTypePlugin,
} from '@cc/lowcode-types'
import {
  ILowCodePluginManager
} from '@cc/lowcode-designer'
import { pluginsSymbol } from '../symbols'

const innerPluginsSymbol = Symbol('plugin')

export class Plugins implements IPublicApiPlugins {
  private readonly [innerPluginsSymbol]: ILowCodePluginManager

  get [pluginsSymbol](): ILowCodePluginManager {
    return this[innerPluginsSymbol]
  }

  constructor(plugins: ILowCodePluginManager) {
    this[innerPluginsSymbol] = plugins
  }

  async register(
    pluginModel: IPublicTypePlugin
  ): Promise<void> {
    await this[pluginsSymbol].register(pluginModel)
  }

  async init() {
    await this[pluginsSymbol].init()
  }
}