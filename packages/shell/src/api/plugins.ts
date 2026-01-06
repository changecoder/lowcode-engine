import {
  ILowCodePluginManager,
  IPublicApiPlugins,
  IPublicModelPluginInstance,
  IPublicTypePlugin,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
} from '@cc/lowcode-types';
import { pluginsSymbol } from '../symbols';
import { PluginInstance as ShellPluginInstance } from '../model';

const innerPluginsSymbol = Symbol('plugin');

export class Plugins implements IPublicApiPlugins {
  private readonly [innerPluginsSymbol]: ILowCodePluginManager;
  get [pluginsSymbol](): ILowCodePluginManager {
    return this[innerPluginsSymbol];
  }

  constructor(plugins: ILowCodePluginManager) {
    this[innerPluginsSymbol] = plugins;
  }

  getAll() {
    return this[pluginsSymbol].getAll()?.map(d => new ShellPluginInstance(d));
  }

  async init(registerOptions: any) {
    await this[pluginsSymbol].init(registerOptions);
  }

  async register(
    pluginModel: IPublicTypePlugin,
    options?: any,
    registerOptions?: IPublicTypePluginRegisterOptions
  ): Promise<void> {
    await this[pluginsSymbol].register(pluginModel, options, registerOptions);
  }

  getPluginPreference(
    pluginName: string
  ): Record<string, IPublicTypePreferenceValueType> | null | undefined {
    return this[pluginsSymbol].getPluginPreference(pluginName);
  }

  has(pluginName: string) {
    return this[pluginsSymbol].has(pluginName);
  }

  get(pluginName: string): IPublicModelPluginInstance | null {
    const instance = this[pluginsSymbol].get(pluginName);
    if (instance) {
      return new ShellPluginInstance(instance);
    }
    return null;
  }

  async delete(pluginName: string) {
    return await this[pluginsSymbol].delete(pluginName);
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        const _target = target[pluginsSymbol];
        if (_target.pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (_target.pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return _target.pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }
}
