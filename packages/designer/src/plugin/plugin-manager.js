import { LowcodePluginRuntime } from './plugin'
import LowcodePluginContext from './plugin-context'

export class LowcodePluginManager {
  plugins = []
  pluginsMap = new Map()
  pluginContextMap = new Map()

  constructor(contextApiAssembler) {
    this.contextApiAssembler = contextApiAssembler
  }

  async register(pluginModel) {
    const { pluginName, meta } = pluginModel
    if (this.pluginsMap.has(pluginName)) {
      throw new Error(`Plugin with name ${pluginName} exists`)
    }

    const ctx = this._getLowCodePluginContext({ pluginName, meta })

    const config = pluginModel(ctx)

    const plugin = new LowcodePluginRuntime(pluginName, this, config)

    this.plugins.push(plugin)
    this.pluginsMap.set(pluginName, plugin)
  }

  async init() {
    const pluginNames = []
    this.plugins.forEach(plugin => {
      pluginNames.push(plugin.name)
    })
    for (const pluginName of pluginNames) {
      try {
        await this.pluginsMap.get(pluginName)?.init()
      } catch (e) {
        console.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`
        )
      }
    }
  }

  _getLowCodePluginContext(options) {
    const { pluginName } = options
    let context = this.pluginContextMap.get(pluginName)
    if (!context) {
      context = new LowcodePluginContext(options, this.contextApiAssembler)
      this.pluginContextMap.set(pluginName, context)
    }
    return context
  }
}