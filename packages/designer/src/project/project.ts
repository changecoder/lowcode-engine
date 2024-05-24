import { IPublicTypeComponentsMap, IPublicTypeProjectSchema, IPublicTypeRootSchema } from '@cc/lowcode-types'
import { IEventBus, createModuleEventBus } from '@cc/lowcode-editor-core'
import { IDocumentModel } from '..'

import { IDesigner } from '../designer'

export interface IProject {
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
}

export class Project implements IProject {
  private emitter: IEventBus = createModuleEventBus('Project')
  private isRendererReady: boolean = false
  readonly documents: IDocumentModel[] = []
  simulator: any
  private data: IPublicTypeProjectSchema = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: []
  }

  get currentDocument(): IDocumentModel | null | undefined {
    return this.documents.find((doc) => doc.active)
  }

  constructor(readonly designer: IDesigner, schema?: IPublicTypeProjectSchema, readonly viewName = 'global') {
    this.designer = designer
    this.load(schema)
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

  }

  open(doc?: string | IDocumentModel | IPublicTypeRootSchema): IDocumentModel | null {
    return null
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