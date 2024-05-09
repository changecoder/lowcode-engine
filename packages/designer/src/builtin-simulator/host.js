import { assetItem, assetBundle, AssetLevel, AssetType } from '@cc/lowcode-utils'
import { engineConfig, getPublicPath } from '@cc/lowcode-editor-core'

import { createSimulator } from './create-simulator'
import ResourceConsumer from './resource-consumer'

const defaultEnvironment = [
  assetItem(
    AssetType.JSText,
    'window.Vue=parent.Vue;window.__is_simulator_env__=true;',
    undefined,
    'vue',
  )
]

const defaultSimulatorUrl = (() => {
  const publicPath = getPublicPath()
  let urls
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

export class BuiltinSimulatorHost {

  isSimulator = true
    /**
   * 是否为画布自动渲染
   */
  autoRender = true
  _props = {}
  asyncLibraryMap = {}
  libraryMap = {}

  get theme() {
    return this.get('theme')
  }

  get componentsAsset() {
    return this.get('componentsAsset')
  }

  constructor(project, designer) {
    this.project = project
    this.designer = designer

    this.componentsConsumer = new ResourceConsumer(() => this.componentsAsset)

    engineConfig.onGot('appHelper', (data) => {
      // appHelper被config.set修改后触发injectionConsumer.consume回调
      this._appHelper = data
    })
  }

  setProps(props) {
    this._props = props
  }

  set(key, value) {
    this._props = {
      ...this._props,
      [key]: value
    }
  }

  get(key) {
    if (key === 'device') {
      return (
        this.designer?.editor?.get('deviceMapper')?.transform?.(this._props.device) ||
        this._props.device
      );
    }
    return this._props[key]
  }

  /**
   * 有 Renderer 进程连接进来，设置同步机制
   */
  connect(
    renderer
  ) {
    this._renderer = renderer
  }

  async mountContentFrame(iframe) {
    if (!iframe || this._iframe === iframe) {
      return
    }
    this._iframe = iframe

    this._contentWindow = iframe.contentWindow
    this._contentDocument = this._contentWindow.document

    const libraryAsset = this.buildLibrary()

    const vendors = [
      // required & use once
      assetBundle(
        this.get('environment') ||
        defaultEnvironment,
        AssetLevel.Environment
      ),
      // required & use once
      assetBundle(this.get('extraEnvironment'), AssetLevel.Environment),

      // required & use once
      assetBundle(libraryAsset, AssetLevel.Library),
      // required & TODO: think of update
      assetBundle(this.theme, AssetLevel.Theme),
      // required & use once
      assetBundle(
        this.get('simulatorUrl') ||
        defaultSimulatorUrl,
        AssetLevel.Runtime
      )
    ]

    // wait 准备 iframe 内容、依赖库注入
    const renderer = await createSimulator(this, iframe, vendors)

    // wait 业务组件被第一次消费，否则会渲染出错
    await this.componentsConsumer.waitFirstConsume()

    // wait 运行时上下文

    if (Object.keys(this.asyncLibraryMap).length > 0) {
      // 加载异步 Library
      await renderer.loadAsyncLibrary(this.asyncLibraryMap)
      Object.keys(this.asyncLibraryMap).forEach((key) => {
        delete this.asyncLibraryMap[key]
      })
    }

    // ready & render
    renderer.run();
  }

  buildLibrary(library) {
    const _library = library || this.get('library')
    const libraryAsset = []
    const libraryExportList = []
    const functionCallLibraryExportList = []

    if (_library && _library.length) {
      _library.forEach((item) => {
        const { exportMode, exportSourceLibrary } = item
        this.libraryMap[item.package] = item.library
        if (item.async) {
          this.asyncLibraryMap[item.package] = item
        }
        if (item.exportName && item.library) {
          libraryExportList.push(
            `Object.defineProperty(window,'${item.exportName}',{get:()=>window.${item.library}});`
          )
        }
        if (exportMode === 'functionCall' && exportSourceLibrary) {
          functionCallLibraryExportList.push(
            `window["${item.library}"] = window["${exportSourceLibrary}"]("${item.library}", "${item.package}");`
          )
        }
        if (item.editUrls) {
          libraryAsset.push(item.editUrls)
        } else if (item.urls) {
          libraryAsset.push(item.urls)
        }
      })
    }
    libraryAsset.unshift(assetItem(AssetType.JSText, libraryExportList.join('')))
    libraryAsset.push(assetItem(AssetType.JSText, functionCallLibraryExportList.join('')))
    return libraryAsset
  }
}