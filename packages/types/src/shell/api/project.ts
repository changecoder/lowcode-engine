import { IPublicModelDocumentModel } from '../model';
import { IPublicTypeProjectSchema } from '../type';

export interface IBaseApiProject<DocumentModel> {
  /**
   * 获取当前的 document
   */
  get currentDocument(): DocumentModel | null;
  /**
   * 获取当前 project 下所有 documents
   */
  get documents(): DocumentModel[];
  /**
   * 导入 project schema
   */
  importSchema(schema?: IPublicTypeProjectSchema): void;
}

export type IPublicApiProject = IBaseApiProject<IPublicModelDocumentModel>;
