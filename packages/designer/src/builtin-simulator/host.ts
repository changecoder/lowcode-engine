import { getPublicPath, IEventBus, createModuleEventBus } from '@cc/lowcode-editor-core'
import { Designer, IDesigner, IProject, Project } from '..'
import { createSimulator } from './create-simulator'
import { Asset, AssetLevel, AssetList, AssetType, IPublicTypePackage } from '@cc/lowcode-types'
import { assetBundle, assetItem } from '@cc/lowcode-utils'

const defaultSimulatorUrl = (() => {
  const publicPath = getPublicPath()
  let urls;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_, prefix = '', dev] = /^(.+?)(\/js)?\/?$/.exec(publicPath) || []
  if (dev) {
    urls = [
      `${prefix}/css/vue-simulator-renderer.css`,
      `${prefix}/js/vue-simulator-renderer.js`
    ]
  } else if (process.env.NODE_ENV === 'production') {
    urls = [`${prefix}/vue-simulator-renderer.css`, `${prefix}/vue-simulator-renderer.js`]
  } else {
    urls = [`${prefix}/vue-simulator-renderer.css`, `${prefix}/vue-simulator-renderer.js`]
  }
  return urls
})()

const defaultEnvironment = [
  assetItem(
    AssetType.JSText,
    'window.Vue=parent.Vue;window.__is_simulator_env__=true;',
    undefined,
    'vue'
  )
]
export type LibraryItem = IPublicTypePackage & {
  package: string
  library: string
  urls?: Asset
  editUrls?: Asset
}

export class BuiltinSimulatorHost {
  readonly isSimulator = true
  readonly project: IProject
  readonly designer: IDesigner
  readonly emitter: IEventBus = createModuleEventBus('BuiltinSimulatorHost')
  private iframe?: HTMLIFrameElement
  private contentWindow?: Window
  private contentDocument?: Document
  readonly asyncLibraryMap: { [key: string]: {} } = {}
  readonly libraryMap: { [key: string]: string } = {}

  renderer?: any
  props: any = {}

  constructor(project: Project, designer: Designer) {
    this.project = project
    this.designer = designer
  }

  setProps(props: any) {
    this.props = props
  }

  set(key: string, value: any) {
    this.props = {
      ...this.props,
      [key]: value
    }
  }

  get(key: string): any {
    return this.props[key]
  }

  connect(
    renderer: any
  ) {
    this.renderer = renderer
  }

  buildLibrary(library?: LibraryItem[]) {
    const _library = library || (this.get('library') as LibraryItem[])
    const libraryAsset: AssetList = []
    const libraryExportList: string[] = [];
    const functionCallLibraryExportList: string[] = [];

    if (_library && _library.length) {
      _library.forEach((item) => {
        this.libraryMap[item.package] = item.library
        if (item.editUrls) {
          libraryAsset.push(item.editUrls)
        } else if (item.urls) {
          libraryAsset.push(item.urls)
        }
      })
    }
    if (libraryExportList?.length) {
      libraryAsset.unshift(assetItem(AssetType.JSText, libraryExportList.join('')))
    }
    if (functionCallLibraryExportList?.length) {
      libraryAsset.push(assetItem(AssetType.JSText, functionCallLibraryExportList.join('')))
    }
    return libraryAsset
  }

  async setupComponents(library: LibraryItem) {

  }

  async mountContentFrame(iframe: HTMLIFrameElement | null): Promise<void> {
    if (!iframe || this.iframe === iframe) {
      return
    }
    this.iframe = iframe
    this.contentWindow = iframe.contentWindow!
    this.contentDocument = this.contentWindow.document

    const libraryAsset: AssetList = this.buildLibrary()

    const vendors = [
      assetBundle(
        this.get('environment') ||
        defaultEnvironment,
        AssetLevel.Environment
      ),
      assetBundle(libraryAsset, AssetLevel.Library),
      assetBundle(
        this.get('simulatorUrl') ||
        defaultSimulatorUrl,
        AssetLevel.Runtime
      )
    ]
    // 准备 iframe 内容、依赖库注入
    const renderer = await createSimulator(this, iframe, vendors)

    renderer.run()
  }
}