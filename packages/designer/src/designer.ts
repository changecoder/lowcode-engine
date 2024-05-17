import { mergeAssets } from '@cc/lowcode-utils'
import { Project } from './project'

export class Designer {
  readonly editor: any
  readonly project: any
  private _componentMetasMap = new Map<string, any>()

  get componentsMap(): { [key: string]: any } {
    const maps: any = {};
    const designer = this;
    designer._componentMetasMap.forEach((config: any, key: string) => {
      const metaData = config.getMetadata()
      if (metaData.devMode === 'lowCode') {
        maps[key] = metaData.schema
      } else {
        const { view } = config.advanced
        if (view) {
          maps[key] = view
        } else {
          maps[key] = config.npm
        }
      }
    })
    return maps
  }

  constructor(props: any) {
    const { editor } = props
    this.editor = editor
    this.project = new Project(this, props.defaultSchema)
  }

  async loadIncrementalAssets(incrementalAssets: any): Promise<void> {
    const { components, packages } = incrementalAssets
    components && this.buildComponentMetasMap(components)
    if (packages) {
      // await this.project.simulator?.setupComponents(packages)
    }

    if (components) {
      // 合并 assets
      let assets = this.editor.get('assets') || {}
      let newAssets = mergeAssets(assets, incrementalAssets)
      // 对于 assets 存在需要二次网络下载的过程，必须 await 等待结束之后，再进行事件触发
      await this.editor.set('assets', newAssets)
    }
    // 完成加载增量资源后发送事件，方便插件监听并处理相关逻辑
    this.editor.eventBus.emit('designer.incrementalAssetsReady');
  }

  buildComponentMetasMap(metas: any[]) {
    metas.forEach((data) => this.createComponentMeta(data))
    console.log(this._componentMetasMap)
  }

  createComponentMeta(data: any): any {
    const key = data.componentName
    if (!key) {
      return null
    }
    let meta = this._componentMetasMap.get(key)
    if (meta) {
      this._componentMetasMap.set(key, meta);
    }
    return meta
  }
}