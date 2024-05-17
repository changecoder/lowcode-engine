import { editorSymbol, designerSymbol } from '../symbols'

const innerEditorSymbol = Symbol('editor')

export class Material {
  private readonly [innerEditorSymbol]: any

  get [editorSymbol](): any {
    return this[innerEditorSymbol]
  }

  get [designerSymbol](): any {
    return this[editorSymbol].get('designer')
  }

  constructor(editor: any) {
    this[innerEditorSymbol] = editor
  }

  getAssets(): any {
    return this[editorSymbol].get('assets')
  }

  /**
   * 加载增量的「资产包」结构，该增量包会与原有的合并
   * @param incrementalAssets
   * @returns
   */
  loadIncrementalAssets(incrementalAssets: any) {
    return this[designerSymbol].loadIncrementalAssets(incrementalAssets)
  }

  /**
   * 监听 assets 变化的事件
   * @param fn
   */
  onChangeAssets(fn: () => void): Function {
      const dispose = [
        // 设置 assets，经过 setAssets 赋值
        this[editorSymbol].onChange('assets', fn),
        // 增量设置 assets，经过 loadIncrementalAssets 赋值
        this[editorSymbol].eventBus.on('designer.incrementalAssetsReady', fn)
      ]
  
      return () => {
        dispose.forEach(d => d && d())
      }
    }
}