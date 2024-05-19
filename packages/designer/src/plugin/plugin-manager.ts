import { IPublicTypePlugin, IPublicTypePluginConfig } from '@cc/lowcode-types'
import { 
  ILowCodePluginManager,
  ILowCodePluginContextApiAssembler
} from './plugin-types'
import sequencify from './sequencify'
import LowCodePluginContext from './plugin-context'

interface ILowCodePluginRuntime {
  name: string
  dep: string[]
  init(): void
}

export class LowCodePluginRuntime implements ILowCodePluginRuntime {
  config: IPublicTypePluginConfig
  private manager: ILowCodePluginManager
  private _inited: boolean
  private pluginName: string

  get name() {
    return this.pluginName
  }

  get dep() {
    return []
  }

  constructor(
    pluginName: string,
    manager: ILowCodePluginManager,
    config: IPublicTypePluginConfig
   ) {
    this.manager = manager
    this.pluginName = pluginName
    this.config = config
  }

  async init() {
    if (this._inited) {
      return
    }
    await this.config.init?.call(undefined);
    this._inited = true
  }
}

export class LowCodePluginManager implements ILowCodePluginManager {
  private plugins: ILowCodePluginRuntime[] = []
  pluginsMap: Map<string, ILowCodePluginRuntime> = new Map()
  pluginContextMap: Map<string, LowCodePluginContext> = new Map();
  contextApiAssembler: ILowCodePluginContextApiAssembler

  constructor(contextApiAssembler: ILowCodePluginContextApiAssembler) {
    this.contextApiAssembler = contextApiAssembler
  }

  register(pluginModel: IPublicTypePlugin): void {
    const { pluginName} = pluginModel
    const ctx = this._getLowCodePluginContext({ pluginName })
    const config = pluginModel(ctx, {})
    const plugin = new LowCodePluginRuntime(pluginName, this, config)
    this.plugins.push(plugin)
    this.pluginsMap.set(pluginName, plugin)
  }

  async init() {
    const pluginNames: string[] = []
    const pluginObj: { [name: string]: ILowCodePluginRuntime } = {}
    this.plugins.forEach((plugin) => {
      pluginNames.push(plugin.name)
      pluginObj[plugin.name] = plugin
    });
    const { sequence } = sequencify(pluginObj, pluginNames);


    for (const pluginName of sequence) {
      try {
        await this.pluginsMap.get(pluginName)?.init()
      } catch (e) /* istanbul ignore next */ {
        console.log(e)
        console.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`
        )
      }
    }
  }

  _getLowCodePluginContext = (options: any) => {
    const { pluginName } = options
    let context = this.pluginContextMap.get(pluginName)
    if (!context) {
      context = new LowCodePluginContext(options, this.contextApiAssembler)
      this.pluginContextMap.set(pluginName, context)
    }
    return context
  }
}