import { editorSymbol, designerSymbol } from '../symbols'

const innerEditorSymbol = Symbol('editor')

export class Material {
  get [editorSymbol]() {
    return this[innerEditorSymbol]
  }

  get [designerSymbol]() {
    return this[editorSymbol].get('designer')
  }

  constructor(editor, workspaceMode = false) {
    this[innerEditorSymbol] = editor
    this.workspaceMode = workspaceMode
  }

  async setAssets(assets) {
    return await this[editorSymbol].setAssets(assets)
  }

  getAssets() {
    return this[editorSymbol].get('assets')
  }
}