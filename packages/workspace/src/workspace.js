import { createModuleEventBus } from '@cc/lowcode-editor-core'

export class Workspace {
  emitter = createModuleEventBus('workspace')

  _isActive = false

  get isActive() {
    return this._isActive
  }

  constructor(
    registryInnerPlugin
  ) {
    this.registryInnerPlugin = registryInnerPlugin
  }
}