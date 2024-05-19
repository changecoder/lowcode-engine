import {
  IProject as InnerProject
} from '@cc/lowcode-designer'
import {
  IPublicTypeRootSchema,
  IPublicTypeProjectSchema,
  IPublicModelDocumentModel,
  IPublicApiProject,
  IPublicModelEditor
} from '@cc/lowcode-types'

import { projectSymbol, editorSymbol } from '../symbols'
import { DocumentModel as ShellDocumentModel } from '../model'

const innerProjectSymbol = Symbol('innerProject')

export class Project implements IPublicApiProject {
  private readonly [innerProjectSymbol]: InnerProject

  get [projectSymbol](): InnerProject {
    return this[innerProjectSymbol]
  }

  get [editorSymbol](): IPublicModelEditor {
    return this[projectSymbol]?.designer.editor
  }

  /**
   * 获取当前的 document
   * @returns
   */
  get currentDocument(): IPublicModelDocumentModel | null {
    return this.getCurrentDocument()
  } 

  /**
   * 获取当前 project 下所有 documents
   * @returns
   */
  get documents(): IPublicModelDocumentModel[] {
    return this[projectSymbol].documents.map((doc) => ShellDocumentModel.create(doc)!)
  }

  constructor(project: InnerProject) {
    this[innerProjectSymbol] = project
  }

  static create(project: InnerProject) {
    return new Project(project)
  }

  /**
   * 打开一个 document
   * @param doc
   * @returns
   */
  openDocument(doc?: string | IPublicTypeRootSchema | undefined) {
    const documentModel = this[projectSymbol].open(doc)
    if (!documentModel) {
      return null;
    }
    return ShellDocumentModel.create(documentModel);
  }

  /**
   * 导入 project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: IPublicTypeProjectSchema): void {
    this[projectSymbol].load(schema, true)
  }

  /**
   * 获取当前的 document
   * @returns
   */
  getCurrentDocument(): IPublicModelDocumentModel | null {
    return ShellDocumentModel.create(this[projectSymbol].currentDocument)
  }

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onSimulatorRendererReady(fn: () => void): any {
    const offFn = this[projectSymbol].onRendererReady(() => {
      fn()
    })
    return offFn
  }
}