import {
  IPublicModelDocumentModel
} from '@cc/lowcode-types'
import {
  IDocumentModel as InnerDocumentModel
} from '@cc/lowcode-designer'

import { documentSymbol } from '../symbols'

const shellDocSymbol = Symbol('shellDocSymbol')

export class DocumentModel implements IPublicModelDocumentModel {

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document
  }

  static create(document: InnerDocumentModel | undefined | null): IPublicModelDocumentModel | null {
    if (!document) {
      return null
    }
    // @ts-ignore 直接返回已挂载的 shell doc 实例
    if (document[shellDocSymbol]) {
      return (document as any)[shellDocSymbol]
    }
    const shellDoc = new DocumentModel(document)
    // @ts-ignore 直接返回已挂载的 shell doc 实例
    document[shellDocSymbol] = shellDoc
    return shellDoc
  }
}