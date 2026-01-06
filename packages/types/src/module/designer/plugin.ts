import {
  IPublicApiEvent,
  IPublicApiLogger,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicModelPluginContext,
  IPublicTypePlugin,
  IPublicTypePluginConfig,
  IPublicTypePluginMeta,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
} from '../../shell';

export type PluginPreference = Map<string, Record<string, IPublicTypePreferenceValueType>>;

interface ILowCodePluginRuntimeExportsAccessor {
  [propName: string]: any;
}

export interface IPluginContextOptions {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}

export interface ILowCodePluginRuntimeCore {
  name: string;
  dep: string[];
  disabled: boolean;
  config: IPublicTypePluginConfig;
  logger: IPublicApiLogger;
  meta: IPublicTypePluginMeta;
  init(forceInit?: boolean): void;
  isInited(): boolean;
  destroy(): void;
  toProxy(): any;
  setDisabled(flag: boolean): void;
}

export type ILowCodePluginRuntime = ILowCodePluginRuntimeCore &
  ILowCodePluginRuntimeExportsAccessor;

interface ILowCodePluginManagerPluginAccessor {
  [pluginName: string]: ILowCodePluginRuntime | any;
}

export interface IPluginPreferenceMananger {
  getPreferenceValue: (
    key: string,
    defaultValue?: IPublicTypePreferenceValueType
  ) => IPublicTypePreferenceValueType | undefined;
}

export interface ILowCodePluginManagerCore {
  register(
    pluginModel: IPublicTypePlugin,
    pluginOptions?: any,
    options?: IPublicTypePluginRegisterOptions
  ): Promise<void>;
  init(
    pluginPreference?: Map<string, Record<string, IPublicTypePreferenceValueType>>
  ): Promise<void>;
  get(pluginName: string): ILowCodePluginRuntime | undefined;
  getAll(): ILowCodePluginRuntime[];
  has(pluginName: string): boolean;
  delete(pluginName: string): any;
  setDisabled(pluginName: string, flag: boolean): void;
  dispose(): void;
  _getLowCodePluginContext(options: IPluginContextOptions): IPublicModelPluginContext;
}

export type ILowCodePluginManager = ILowCodePluginManagerCore & ILowCodePluginManagerPluginAccessor;

export interface ILowCodePluginContextPrivate {
  set logger(plugins: IPublicApiLogger);
  set plugins(plugins: IPublicApiPlugins);
  set event(event: IPublicApiEvent);
  set skeleton(skeleton: IPublicApiSkeleton);
}

export interface ILowCodePluginContextApiAssembler {
  assembleApis(
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta
  ): void;
}

export interface IPluginContextOptions {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}
