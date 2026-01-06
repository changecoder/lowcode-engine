import {
  IPublicModelEngineConfig,
  IPublicModelPreference,
  IPublicTypeDisposable,
  IPublicTypeEngineOptions,
} from '@cc/lowcode-types';
import { isPlainObject } from '@cc/lowcode-utils';
import Preference from './utils/preference';
import { getLogger } from './utils/logger';

const STRICT_PLUGIN_MODE_DEFAULT = true;

const VALID_ENGINE_OPTIONS = {
  enableCondition: {
    type: 'boolean',
    description: '是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示',
  },
  designMode: {
    type: 'string',
    enum: ['design', 'live'],
    default: 'design',
    description: '设计模式，live 模式将会实时展示变量值',
  },
  device: {
    type: 'string',
    enum: ['default', 'mobile', 'any string value'],
    default: 'default',
    description: '设备类型',
  },
  deviceClassName: {
    type: 'string',
    default: undefined,
    description: '指定初始化的 deviceClassName，挂载到画布的顶层节点上',
  },
  locale: {
    type: 'string',
    default: 'zh-CN',
    description: '语言',
  },
  renderEnv: {
    type: 'string',
    enum: ['react', 'any string value'],
    default: 'react',
    description: '渲染器类型',
  },
  deviceMapper: {
    type: 'object',
    description: '设备类型映射器，处理设计器与渲染器中 device 的映射',
  },
  enableStrictPluginMode: {
    type: 'boolean',
    default: STRICT_PLUGIN_MODE_DEFAULT,
    description:
      '开启严格插件模式，默认值：STRICT_PLUGIN_MODE_DEFAULT , 严格模式下，插件将无法通过 engineOptions 传递自定义配置项',
  },
  enableReactiveContainer: {
    type: 'boolean',
    default: false,
    description: '开启拖拽组件时，即将被放入的容器是否有视觉反馈',
  },
  disableAutoRender: {
    type: 'boolean',
    default: false,
    description: '关闭画布自动渲染，在资产包多重异步加载的场景有效',
  },
  disableDetecting: {
    type: 'boolean',
    default: false,
    description: '关闭拖拽组件时的虚线响应，性能考虑',
  },
  customizeIgnoreSelectors: {
    type: 'function',
    default: undefined,
    description:
      '定制画布中点击被忽略的 selectors, eg. (defaultIgnoreSelectors: string[], e: MouseEvent) => string[]',
  },
  disableDefaultSettingPanel: {
    type: 'boolean',
    default: false,
    description: '禁止默认的设置面板',
  },
  disableDefaultSetters: {
    type: 'boolean',
    default: false,
    description: '禁止默认的设置器',
  },
  enableCanvasLock: {
    type: 'boolean',
    default: false,
    description: '打开画布的锁定操作',
  },
  enableLockedNodeSetting: {
    type: 'boolean',
    default: false,
    description: '容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效',
  },
  hideSettingsTabsWhenOnlyOneItem: {
    type: 'boolean',
    description: '是否在只有一个 item 的时候隐藏设置 tabs',
  },
  loadingComponent: {
    type: 'ComponentType',
    default: undefined,
    description: '自定义 loading 组件',
  },
  supportVariableGlobally: {
    type: 'boolean',
    default: false,
    description: '设置所有属性支持变量配置',
  },
  visionSettings: {
    type: 'object',
    description: 'Vision-polyfill settings',
  },
  simulatorUrl: {
    type: 'array',
    description: '自定义 simulatorUrl 的地址',
  },
  appHelper: {
    type: 'object',
    description: '定义 utils 和 constants 等对象',
  },
  requestHandlersMap: {
    type: 'object',
    description: '数据源引擎的请求处理器映射',
  },
  thisRequiredInJSE: {
    type: 'boolean',
    description: 'JSExpression 是否只支持使用 this 来访问上下文变量',
  },
  enableStrictNotFoundMode: {
    type: 'boolean',
    description: '当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件',
  },
  focusNodeSelector: {
    type: 'function',
    description: '配置指定节点为根组件',
  },
  enableContextMenu: {
    type: 'boolean',
    description: '是否开启右键菜单',
    default: false,
  },
  hideComponentAction: {
    type: 'boolean',
    description: '是否隐藏设计器辅助层',
    default: false,
  },
};

const logger = getLogger({ level: 'log', bizName: 'config' });

function lodashGet(obj: { [key: string]: any }, path: string, defaultValue: any) {
  const keys = path.split('.');
  let result = obj;
  for (const key of keys) {
    result = result?.[key];
    if (result === undefined) {
      return defaultValue;
    }
  }
  return result;
}

const getStrictModeValue = (
  engineOptions: IPublicTypeEngineOptions,
  defaultValue: boolean
): boolean => {
  if (!engineOptions || !isPlainObject(engineOptions)) {
    return defaultValue;
  }
  if (
    engineOptions.enableStrictPluginMode === undefined ||
    engineOptions.enableStrictPluginMode === null
  ) {
    return defaultValue;
  }
  return engineOptions.enableStrictPluginMode;
};

export interface IEngineConfig extends IPublicModelEngineConfig {
  setEngineOptions(engineOptions: IPublicTypeEngineOptions): void;
  notifyGot(key: string): void;
  setWait(key: string, resolve: (data: any) => void, once?: boolean): void;
  delWait(key: string, fn: any): void;
}

export class EngineConfig implements IEngineConfig {
  private config: { [key: string]: any } = {};
  private waits = new Map<
    string,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
    }>
  >();
  readonly preference: IPublicModelPreference;
  constructor(config?: { [key: string]: any }) {
    this.config = config || {};
    this.preference = new Preference();
  }
  notifyGot(key: string): void {
    let waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    waits = waits.slice().reverse();
    let i = waits.length;
    while (i--) {
      waits[i].resolve(this.get(key));
      if (waits[i].once) {
        waits.splice(i, 1);
      }
    }
    if (waits.length > 0) {
      this.waits.set(key, waits);
    } else {
      this.waits.delete(key);
    }
  }
  setWait(key: string, resolve: (data: any) => void, once?: boolean): void {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }
  delWait(key: string, fn: any): void {
    const waits = this.waits.get(key);
    if (!waits) {
      return;
    }
    let i = waits.length;
    while (i--) {
      if (waits[i].resolve === fn) {
        waits.splice(i, 1);
      }
    }
    if (waits.length < 1) {
      this.waits.delete(key);
    }
  }
  has(key: string): boolean {
    return this.config[key] !== undefined;
  }
  get(key: string, defaultValue?: any) {
    return lodashGet(this.config, key, defaultValue);
  }
  set(key: string, value: any): void {
    this.config[key] = value;
    this.notifyGot(key);
  }
  setConfig(config: { [key: string]: any }): void {
    if (config) {
      Object.keys(config).forEach(key => {
        this.set(key, config[key]);
      });
    }
  }
  onceGot(key: string): Promise<any> {
    const val = this.config[key];
    if (val !== undefined) {
      return Promise.resolve(val);
    }
    return new Promise(resolve => {
      this.setWait(key, resolve, true);
    });
  }
  onGot(key: string, fn: (data: any) => void): IPublicTypeDisposable {
    const val = this.config?.[key];
    if (val !== undefined) {
      fn(val);
    }
    this.setWait(key, fn);
    return () => {
      this.delWait(key, fn);
    };
  }
  getPreference(): IPublicModelPreference {
    return this.preference;
  }
  setEngineOptions(engineOptions: IPublicTypeEngineOptions) {
    if (!engineOptions || !isPlainObject(engineOptions)) {
      return;
    }
    const strictMode = getStrictModeValue(engineOptions, STRICT_PLUGIN_MODE_DEFAULT) === true;
    if (strictMode) {
      const isValidKey = (key: string) => {
        const result = (VALID_ENGINE_OPTIONS as any)[key];
        return !(result === undefined || result === null);
      };
      Object.keys(engineOptions).forEach(key => {
        if (isValidKey(key)) {
          this.set(key, (engineOptions as any)[key]);
        } else {
          logger.warn(
            `failed to config ${key} to engineConfig, only predefined options can be set under strict mode, predefined options: `,
            VALID_ENGINE_OPTIONS
          );
        }
      });
    } else {
      this.setConfig(engineOptions as any);
    }
  }
}

export const engineConfig = new EngineConfig();
