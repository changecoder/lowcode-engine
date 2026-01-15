import { shallowReactive } from 'vue';
import { EventEmitter } from 'events';
import {
  EditorConfig,
  EventConfig,
  IEditor,
  IPublicTypeAssetsJson,
  IPublicTypeComponentDescription,
  IPublicTypeEditorGetResult,
  IPublicTypeEditorValueKey,
  IPublicTypeRemoteComponentDescription,
} from '@cc/lowcode-types';
import { AssetLoader } from '@cc/lowcode-utils';
import { EventBus } from './event-bus';
import { globalLocale } from './intl/global-locale';
import { engineConfig } from './config';
import { assetsTransform } from './utils/assets-transform';

EventEmitter.defaultMaxListeners = 100;

const keyBlacklist = [
  'designer',
  'skeleton',
  'currentDocument',
  'simulator',
  'plugins',
  'setters',
  'material',
  'innerHotkey',
  'innerPlugins',
];

const AssetsCache: {
  [key: string]: IPublicTypeRemoteComponentDescription;
} = {};

export class Editor extends EventEmitter implements IEditor {
  private context = shallowReactive(new Map<IPublicTypeEditorValueKey, any>());
  config?: EditorConfig;
  eventBus: EventBus;

  get locale() {
    return globalLocale.getLocale();
  }

  private waits = new Map<
    IPublicTypeEditorValueKey,
    Array<{
      once?: boolean;
      resolve: (data: any) => void;
    }>
  >();
  onGot: <T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void
  ) => () => void;
  ' _emitterType'?: EventEmitter<any> | undefined;
  ' _eventsType'?: EventConfig | undefined;
  ' _emitType'?: EventConfig | undefined;

  constructor(readonly viewName: string = 'global', readonly workspaceMode: boolean = false) {
    super();
    this.setMaxListeners(200);
    this.eventBus = new EventBus(this);
  }

  async setAssets(assets: IPublicTypeAssetsJson) {
    const { components } = assets;
    if (components && components.length) {
      const componentDescriptions: IPublicTypeComponentDescription[] = [];
      const remoteComponentDescriptions: IPublicTypeRemoteComponentDescription[] = [];
      components.forEach((component: any) => {
        if (!component) {
          return;
        }
        if (component.exportName && component.url) {
          remoteComponentDescriptions.push(component);
        } else {
          componentDescriptions.push(component);
        }
      });
      assets.components = componentDescriptions;
      // 如果有远程组件描述协议，则自动加载并补充到资产包中，同时出发 designer.incrementalAssetsReady 通知组件面板更新数据
      if (remoteComponentDescriptions && remoteComponentDescriptions.length) {
        await Promise.all(
          remoteComponentDescriptions.map(
            async (component: IPublicTypeRemoteComponentDescription) => {
              const { exportName, url, npm } = component;
              if (!url || !exportName) {
                return;
              }
              if (
                !AssetsCache[exportName] ||
                !npm?.version ||
                AssetsCache[exportName].npm?.version !== npm?.version
              ) {
                await new AssetLoader().load(url);
              }
              AssetsCache[exportName] = component;
              function setAssetsComponent(component: any, extraNpmInfo: any = {}) {
                const components = component.components;
                if (Array.isArray(components)) {
                  components.forEach(d => {
                    assets.components = assets.components.concat({
                      npm: {
                        ...npm,
                        ...extraNpmInfo,
                      },
                      ...d,
                    });
                  });
                  return;
                }
                if (component.components) {
                  assets.components = assets.components.concat({
                    npm: {
                      ...npm,
                      ...extraNpmInfo,
                    },
                    ...component.components,
                  });
                }
              }
              function setArrayAssets(
                value: any[],
                preExportName: string = '',
                preSubName: string = ''
              ) {
                value.forEach((d: any, i: number) => {
                  const exportName = [preExportName, i.toString()].filter(d => !!d).join('.');
                  const subName = [preSubName, i.toString()].filter(d => !!d).join('.');
                  if (Array.isArray(d)) {
                    setArrayAssets(d, exportName, subName);
                  } else {
                    setAssetsComponent(d, {
                      exportName,
                      subName,
                    });
                  }
                });
              }
              if ((window as any)[exportName]) {
                if (Array.isArray((window as any)[exportName])) {
                  setArrayAssets((window as any)[exportName] as any);
                } else {
                  setAssetsComponent((window as any)[exportName] as any);
                }
              }
              return (window as any)[exportName];
            }
          )
        );
      }
    }
    const innerAssets = assetsTransform(assets);
    this.context.set('assets', innerAssets);
    this.notifyGot('assets');
  }

  get<T = undefined, KeyOrType = any>(
    keyOrType: KeyOrType
  ): IPublicTypeEditorGetResult<T, KeyOrType> | undefined {
    return this.context.get(keyOrType as any);
  }

  set(key: IPublicTypeEditorValueKey, data: any): void | Promise<void> {
    if (key === 'assets') {
      return this.setAssets(data);
    }
    if (!keyBlacklist.includes(key as string)) {
      engineConfig.set(key as any, data);
    }
    this.context.set(key, data);
    this.notifyGot(key);
  }

  has(keyOrType: IPublicTypeEditorValueKey): boolean {
    return this.context.has(keyOrType);
  }

  onceGot<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType
  ): Promise<IPublicTypeEditorGetResult<T, KeyOrType>> {
    const value = this.context.get(keyOrType);
    if (value !== undefined) {
      return Promise.resolve(value);
    }
    return new Promise(resolve => {
      this.setWait(keyOrType, resolve, true);
    });
  }

  onGet<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void
  ): () => void {
    const value = this.context.get(keyOrType);
    if (value !== undefined) {
      fn(value);
    }
    this.setWait(keyOrType, fn);
    return () => {
      this.delWait(keyOrType, fn);
    };
  }

  register(data: any, key?: IPublicTypeEditorValueKey): void {
    this.context.set(key || data, data);
    this.notifyGot(key || data);
  }

  onChange<T = undefined, KeyOrType extends IPublicTypeEditorValueKey = any>(
    keyOrType: KeyOrType,
    fn: (data: IPublicTypeEditorGetResult<T, KeyOrType>) => void
  ) {
    this.setWait(keyOrType, fn);
    return () => {
      this.delWait(keyOrType, fn);
    };
  }

  private notifyGot(key: IPublicTypeEditorValueKey) {
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

  private setWait(key: IPublicTypeEditorValueKey, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key);
    if (waits) {
      waits.push({ resolve, once });
    } else {
      this.waits.set(key, [{ resolve, once }]);
    }
  }

  private delWait(key: IPublicTypeEditorValueKey, fn: any) {
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
}

export const commonEvent = new EventBus(new EventEmitter());
