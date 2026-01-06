import {
  ILowCodePluginManager,
  ILowCodePluginRuntime,
  IPublicApiLogger,
  IPublicTypePluginConfig,
  IPublicTypePluginMeta,
} from '@cc/lowcode-types';
import { getLogger } from '@cc/lowcode-utils';
import { invariant } from '../invariant';

export class LowCodePluginRuntime implements ILowCodePluginRuntime {
  private _disabled: boolean = false;
  private _inited: boolean = false;
  private pluginName: string;
  private manager: ILowCodePluginManager;
  config: IPublicTypePluginConfig;
  logger: IPublicApiLogger;
  meta: IPublicTypePluginMeta;

  get name() {
    return this.pluginName;
  }

  get dep() {
    if (typeof this.meta.dependencies === 'string') {
      return [this.meta.dependencies];
    }
    const legacyDepValue = (this.config as any).dep;
    if (typeof legacyDepValue === 'string') {
      return [legacyDepValue];
    }
    return this.meta.dependencies || legacyDepValue || [];
  }

  get disabled() {
    return this._disabled;
  }

  constructor(
    pluginName: string,
    manager: ILowCodePluginManager,
    config: IPublicTypePluginConfig,
    meta: IPublicTypePluginMeta
  ) {
    this.manager = manager;
    this.config = config;
    this.pluginName = pluginName;
    this.meta = meta;
    this.logger = getLogger({ level: 'warn', bizName: `plugin:${pluginName}` });
  }

  async init(forceInit?: boolean) {
    if (this._inited && !forceInit) return;
    this.logger.log('method init called');
    await this.config.init?.call(undefined);
    this._inited = true;
  }

  isInited() {
    return this._inited;
  }

  async destroy() {
    if (!this._inited) {
      return;
    }
    this.logger.log('method destroy called');
    await this.config?.destroy?.call(undefined);
    this._inited = false;
  }

  toProxy() {
    invariant(this._inited, 'Could not call toProxy before init');
    const exports = this.config.exports?.();
    return new Proxy(this, {
      get(target, prop, receiver) {
        if ({}.hasOwnProperty.call(exports, prop)) {
          return exports?.[prop as string];
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  setDisabled(flag = true) {
    this._disabled = flag;
  }

  async dispose() {
    await this.manager.delete(this.name);
  }
}
