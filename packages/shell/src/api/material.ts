import { IPublicApiMaterial, IPublicModelEditor, IPublicTypeAssetsJson } from '@cc/lowcode-types'
import {
  IDesigner
} from '@cc/lowcode-designer'

import { editorSymbol, designerSymbol } from '../symbols'

const innerEditorSymbol = Symbol('editor')

export class Material implements IPublicApiMaterial {
  private readonly [innerEditorSymbol]: IPublicModelEditor
  
  get [editorSymbol](): IPublicModelEditor {
    return this[innerEditorSymbol]
  }

  get [designerSymbol](): IDesigner {
    return this[editorSymbol].get('designer')
  }

  constructor(editor: IPublicModelEditor) {
    this[innerEditorSymbol] = editor
  }

  /**
   * 设置「资产包」结构
   * @param assets
   * @returns
   */
  async setAssets(assets: IPublicTypeAssetsJson): Promise<void> {
    return await this[editorSymbol].setAssets(assets)
  }

  /**
   * 获取「资产包」结构
   * @returns
   */  
  getAssets(): IPublicTypeAssetsJson | undefined {
    return this[editorSymbol].get('assets')
  }

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: IPublicTypeAssetsJson): Promise<void> {
    return this[designerSymbol].loadIncrementalAssets(incrementalAssets)
  }
  
}