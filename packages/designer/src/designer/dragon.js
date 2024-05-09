import { createModuleEventBus } from '@cc/lowcode-editor-core'

/**
 * Drag-on 拖拽引擎
 */
export class Dragon {
  _dragging = false
  _canDrop = false
  emitter = createModuleEventBus('Dragon')

  get dragging() {
    return this._dragging
  }

  constructor(designer) {
    this.designer = designer
    this.viewName = designer.viewName
  }
}