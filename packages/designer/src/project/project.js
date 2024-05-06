import { createModuleEventBus } from '@cc/lowcode-editor-core'

export class Project {
  emitter = createModuleEventBus('Project')

  documents = []
  data = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: []
  }
  documentsMap = new Map()
  isRendererReady = false
  _config = {}

  get config() {
    return this._config
  }

  set config(value) {
    this._config = value
  }

  get simulator() {
    return this._simulator || null
  }

  get currentDocument() {
    return this.documents.find((doc) => doc.active)
  }

  constructor(designer, schema, viewName = 'global') {
    this.designer = designer
    this.viewName = viewName
    this.load(schema)
  }

  /**
   * 整体设置项目 schema
   *
   * @param autoOpen true 自动打开文档 string 指定打开的文件
   */
  load(schema, autoOpen) {
    this.unload()
    // load new document
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema
    }
    this.config = schema?.config || this.config
    if (autoOpen) {
      if (autoOpen === true) {
        const documentInstances = this.data.componentsTree.map((data) => this.createDocument(data))
        documentInstances[0].open()
      }
    } else {
      this.open(autoOpen)
    }
  }

  /**
   * 卸载当前项目数据
   */
  unload() {
    if (this.documents.length < 1) {
      return
    }
    for (let i = this.documents.length - 1; i >= 0; i--) {
      this.documents[i].remove()
    }
  }

  open(doc) {
    if (!doc) {
      const got = this.documents.find((item) => item.isBlank())
      if (got) {
        return got.open()
      }
    }
  }

  createDocument(data) {
    const doc = new DocumentModel(this, data || this?.data?.componentsTree?.[0])
    this.documents.push(doc)
    this.documentsMap.set(doc.id, doc)
    return doc
  }

  mountSimulator(simulator) {
    this._simulator = simulator
    this.emitter.emit('lowcode_engine_simulator_ready', simulator)
  }

  onSimulatorReady(fn) {
    if (this._simulator) {
      fn(this._simulator)
      return () => {}
    }
    return () => {
      
    }
  }
}