import { createModuleEventBus } from '@cc/lowcode-utils'

export class DocumentModel {
  constructor(project, schema) {
    this.project = project
    this.schema = schema
    this.designer = this.project?.designer
    this.emitter = createModuleEventBus('DocumentModel')

    if (!schema) {
      this._blank = true
    }

    // 兼容 vision
    this.id = project.getSchema()?.id || this.id

    this.inited = true

    this.rootNode = this.createNode(
      schema || {
        componentName: 'Page',
        id: 'root',
        fileName: ''
      }
    )
  }

  createNode(data) {
    return {}
  }

  /**
   * 打开，已载入，默认建立时就打开状态，除非手动关闭
   */
  open() {
    const originState = this._opened
    this._opened = true
    if (originState === false) {
      this.designer.postEvent('document-open', this)
    }
  }

  /**
   * 从项目中移除
   */
  remove() {
    this.designer.postEvent('document.remove', { id: this.id })
    this.purge();
    this.project.removeDocument(this)
  }

  purge() {
    this.rootNode = null
  }
}