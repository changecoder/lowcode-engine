import { createApp } from 'vue'
import { IDocumentModel } from '@cc/lowcode-designer'
import { SimulatorRendererView } from './renderer-view'
import { host } from './host'

export class DocumentInstance {
  get schema(): any {
    return this.document.export('render')
  }

  constructor(readonly container: any, readonly document: IDocumentModel) {
    this.container = container
    this.document = document
  }
}

class SimulatorRendererContainer {
  readonly isSimulatorRenderer = true
  private _documentInstances: DocumentInstance[] = []
  private _running = false
  get documentInstances() {
    return this._documentInstances
  }
  
  constructor() {
    const documentInstanceMap = new Map<string, DocumentInstance>()
    this._documentInstances = host.project.documents.map((doc) => {
      let inst = documentInstanceMap.get(doc.id)
      if (!inst) {
        inst = new DocumentInstance(this, doc)
        documentInstanceMap.set(doc.id, inst)
      }
      return inst
    })
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

  rerender() {}
}

export default new SimulatorRendererContainer