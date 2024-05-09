import { documentSymbol, editorSymbol } from '../symbols'

const shellDocSymbol = Symbol('shellDocSymbol')

export class DocumentModel {

  constructor(document) {
    this[documentSymbol] = document
    this[editorSymbol] = document.designer?.editor
  }

  static create(document) {
    if (!document) {
      return null
    }
    if (document[shellDocSymbol]) {
      return document[shellDocSymbol]
    }
    const shellDoc = new DocumentModel(document)
    document[shellDocSymbol] = shellDoc
    return shellDoc
  }
}