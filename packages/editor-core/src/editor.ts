import { IPublicModelEditor, IPublicTypeAssetsJson, IPublicTypeComponentDescription, IPublicTypeRemoteComponentDescription } from '@cc/lowcode-types'
import { AssetLoader } from '@cc/lowcode-utils'
import { EventEmitter } from 'events'
import { EventBus, IEventBus } from './event-bus'
import { assetsTransform } from './utils/assets-transform'

const AssetsCache: {
  [key: string]: IPublicTypeRemoteComponentDescription;
} = {}

export interface IEditor extends IPublicModelEditor {
  eventBus: IEventBus
}

export class Editor extends EventEmitter implements IEditor {
  private context = new Map()
  private waits = new Map<
    any,
    Array<{
      once?: boolean,
      resolve: (data: any) => void
    }>
  >()
  eventBus: EventBus
  
  constructor() {
    super()
    this.setMaxListeners(200)
    this.eventBus = new EventBus(this)
  }

  get(keyOrType: any): any {
    return this.context.get(keyOrType)
  }

  set(key: any, data: any): void | Promise<void> {
    if (key === 'assets') {
      return this.setAssets(data)
    }
    this.context.set(key, data)
  }

  onceGot(keyOrType: any): Promise<any> {
    const x = this.context.get(keyOrType)
    if (x !== undefined) {
      return Promise.resolve(x)
    }
    return new Promise((resolve) => {
      this.setWait(keyOrType, resolve, true)
    })
  }

  private setWait(key: any, resolve: (data: any) => void, once?: boolean) {
    const waits = this.waits.get(key)
    if (waits) {
      waits.push({ resolve, once })
    } else {
      this.waits.set(key, [{ resolve, once }])
    }
  }

  async setAssets(assets: IPublicTypeAssetsJson) {
    const { components } = assets
    if (components && components.length) {
      const componentDescriptions: IPublicTypeComponentDescription[] = []
      const remoteComponentDescriptions: IPublicTypeRemoteComponentDescription[] = []
      components.forEach((component) => {
        if (!component) {
          return
        }
        if (component.exportName && component.url) {
          remoteComponentDescriptions.push(component)
        } else {
          componentDescriptions.push(component)
        }
      })
      assets.components = componentDescriptions

      // 如果有远程组件描述协议，则自动加载并补充到资产包中，同时出发 designer.incrementalAssetsReady 通知组件面板更新数据
      if (remoteComponentDescriptions && remoteComponentDescriptions.length) {
        await Promise.all(
          remoteComponentDescriptions.map(async (component) => {
            const { exportName, url, npm } = component
            if (!url || !exportName) {
              return
            }
            if (!AssetsCache[exportName] || !npm?.version || AssetsCache[exportName].npm?.version !== npm?.version) {
              await (new AssetLoader()).load(url)
            }
            AssetsCache[exportName] = component
            function setAssetsComponent(component: any, extraNpmInfo = {}) {
              const components = component.components
              if (Array.isArray(components)) {
                components.forEach(d => {
                  assets.components = assets.components.concat({
                    npm: {
                      ...npm,
                      ...extraNpmInfo,
                    },
                    ...d
                  } || [])
                })
                return
              }
              if (component.components) {
                assets.components = assets.components.concat({
                  npm: {
                    ...npm,
                    ...extraNpmInfo,
                  },
                  ...component.components
                } || [])
              }
            }
            function setArrayAssets(value: any[], preExportName = '', preSubName = '') {
              value.forEach((d, i) => {
                const exportName = [preExportName, i.toString()].filter(d => !!d).join('.')
                const subName = [preSubName, i.toString()].filter(d => !!d).join('.')
                Array.isArray(d) ? setArrayAssets(d, exportName, subName) : setAssetsComponent(d, {
                  exportName,
                  subName
                })
              })
            }
            if ((window as any)[exportName]) {
              if (Array.isArray((window as any)[exportName])) {
                setArrayAssets((window as any)[exportName])
              } else {
                setAssetsComponent((window as any)[exportName])
              }
            }
            return (window as any)[exportName]
          })
        )
      }
    }
    const innerAssets = assetsTransform(assets)
    this.context.set('assets', innerAssets)
  }
}