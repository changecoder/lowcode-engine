import { IPublicModelDocumentModel, IPublicTypeProjectSchema, IPublicTypeRootSchema } from '..'

export interface IBaseApiProject<DocumentModel> {
  /**
   * 获取当前的 document
   * get current document
   */
  get currentDocument(): DocumentModel | null

  /**
   * 获取当前 project 下所有 documents
   * get all documents of this project
   * @returns
   */
  get documents(): DocumentModel[]

  /**
   * 打开一个 document
   * open a document
   * @param doc
   * @returns
   */
  openDocument(doc?: string | IPublicTypeRootSchema | undefined): DocumentModel | null

  /**
   * 导入 project schema
   * import schema to project
   * @param schema 待导入的 project 数据
   */
  importSchema(schema?: IPublicTypeProjectSchema): void
}

export interface IPublicApiProject extends IBaseApiProject<IPublicModelDocumentModel> {}