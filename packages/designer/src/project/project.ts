import { IBaseApiProject, IPublicTypeComponentsMap, IPublicTypeProjectSchema, IPublicTypeRootSchema, IPublicTypeSimulatorRenderer } from '@cc/lowcode-types'
import { IEventBus, createModuleEventBus } from '@cc/lowcode-editor-core'
import { DocumentModel, IDocumentModel, isDocumentModel } from '..'

import { IDesigner } from '../designer'

export interface IProject extends Omit<IBaseApiProject<
IDocumentModel
>, 
  'documents' |
  'currentDocument'
> {
  get designer(): IDesigner

  get currentDocument(): IDocumentModel | null | undefined

  get documents(): IDocumentModel[]

  simulator: any
  
  mountSimulator(simulator: any): void

  open(doc?: string | IDocumentModel | IPublicTypeRootSchema): IDocumentModel | null

  load(schema?: IPublicTypeProjectSchema, autoOpen?: boolean | string): void

  getSchema(
    stage?: string,
  ): IPublicTypeProjectSchema

  onRendererReady(fn: () => void): () => void

  setRendererReady(renderer: IPublicTypeSimulatorRenderer): void
}

export class Project implements IProject {
  private emitter: IEventBus = createModuleEventBus('Project')
  private isRendererReady: boolean = false
  private _config: any = {}
  readonly documents: IDocumentModel[] = []
  simulator: any
  private data: IPublicTypeProjectSchema = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: []
  }
  private documentsMap = new Map<string, DocumentModel>()
  get config(): any {
    return this._config
  }

  set config(value: any) {
    this._config = value
  }

  get currentDocument(): IDocumentModel | null | undefined {
    return this.documents.find((doc) => doc.active)
  }

  constructor(readonly designer: IDesigner, schema?: IPublicTypeProjectSchema, readonly viewName = 'global') {
    this.designer = designer
    this.load(schema)
  }
  setRendererReady(renderer: IPublicTypeSimulatorRenderer): void {
    this.isRendererReady = true
    this.emitter.emit('lowcode_engine_renderer_ready', renderer)
  }
  openDocument(doc?: string | IPublicTypeRootSchema | undefined): IDocumentModel | null {
    throw new Error('Method not implemented.')
  }
  importSchema(schema?: IPublicTypeProjectSchema<IPublicTypeRootSchema> | undefined): void {
    throw new Error('Method not implemented.')
  }

  /**
   * 获取项目整体 schema
   */
  getSchema(
    stage: string = 'save'
  ): IPublicTypeProjectSchema {
    return {
      ...this.data,
      componentsMap: this.getComponentsMap(),
      componentsTree: []
    }
  }

  private getComponentsMap(): IPublicTypeComponentsMap {
    return []
  }
  
  load(schema?: IPublicTypeProjectSchema) {
    this.unload()
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      ...schema
    }
    this.config = schema?.config || this.config
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

  removeDocument(doc: IDocumentModel) {
    const index = this.documents.indexOf(doc)
    if (index < 0) {
      return
    }
    this.documents.splice(index, 1)
    this.documentsMap.delete(doc.id)
  }

  open(doc?: string | IDocumentModel | IPublicTypeRootSchema): IDocumentModel | null {
    if (!doc) {
      doc = this.createDocument()
      return doc.open()
    }
    if (isDocumentModel(doc)) {
      return doc.open()
    }
    doc = this.createDocument(doc as any)
    return doc.open()
  }

  createDocument(data?: IPublicTypeRootSchema): IDocumentModel {
    const doc = new DocumentModel(this, data || this?.data?.componentsTree?.[0])
    this.documents.push(doc)
    this.documentsMap.set(doc.id, doc)
    return doc
  }

  onRendererReady(fn: () => void): () => void {
    if (this.isRendererReady) {
      fn()
    }
    this.emitter.on('lowcode_engine_renderer_ready', fn)
    return () => {
      this.emitter.removeListener('lowcode_engine_renderer_ready', fn)
    }
  }

  mountSimulator(simulator: any) {
    this.simulator = simulator
  }
}