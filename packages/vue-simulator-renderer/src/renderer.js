
import { createApp } from 'vue'
import SimulatorRendererView from './renderer-view.vue'
import { host } from './host'

export class DocumentInstance {
  instancesMap = new Map()

  get schema() {
    return this.document.export('render')
  }

  constructor(container, document) {
    this.container = container
    this.document = document
  }
}

export class SimulatorRendererContainer {
  isSimulatorRenderer = true
  disposeFunctions = []
  _documentInstances = []
  _components = {}
  _libraryMap = {}
  _appContext = {}
  _componentsMap = {}
  _designMode = 'design'
  _device = 'default'
  _running = false
  /**
   * 根据 device 选择不同组件，进行响应式
   * 更好的做法是，根据 device 选择加载不同的组件资源，甚至是 simulatorUrl
   */
  get components() {
    return this._components || {}
  }

  get context() {
    return this._appContext
  }

  get designMode() {
    return this._designMode
  }

  get device() {
    return this._device
  }

  get componentsMap() {
    return this._componentsMap
  }

  get documentInstances() {
    return this._documentInstances
  }

  /**
   * 是否为画布自动渲染
   */
  autoRender = true

  /**
   * 画布是否自动监听事件来重绘节点
   */
  autoRepaintNode = true

  constructor() {
    this.autoRender = host.autoRender

    const documentInstanceMap = new Map()

    this.disposeFunctions.push(host.connect(this, () => {
      this._designMode = host.designMode
      this._requestHandlersMap = host.requestHandlersMap
      this._device = host.device
    }))

    this._documentInstances = host.project.documents.map((doc) => {
      let inst = documentInstanceMap.get(doc.id)
      if (!inst) {
        inst = new DocumentInstance(this, doc)
        documentInstanceMap.set(doc.id, inst)
      }
      return inst
    })

    this._appContext = {
      utils: {},
      constants: {},
      requestHandlersMap: this._requestHandlersMap
    }
  }

  run() {
    if (this._running) {
      return
    }
    this._running = true
    const containerId = 'app'
    let container = document.getElementById(containerId)
    if (!container) {
      container = document.createElement('div')
      document.body.appendChild(container)
      container.id = containerId
    }

    // ==== compatible vision
    document.documentElement.classList.add('engine-page')
    document.body.classList.add('engine-document')

    createApp(SimulatorRendererView, { rendererContainer: this }).mount(container)
    host.project.setRendererReady(this)
  }

  /**
   * 刷新渲染器
   */
  rerender() {
    this.autoRender = true
  }

  stopAutoRepaintNode() {
    this.autoRepaintNode = false
  }

  enableAutoRepaintNode() {
    this.autoRepaintNode = true
  }

  dispose() {
    this.disposeFunctions.forEach((fn) => fn())
  }
}

export default new SimulatorRendererContainer()