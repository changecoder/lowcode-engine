import { globalContext } from '@cc/lowcode-editor-core'

import { editorSymbol, projectSymbol, simulatorHostSymbol } from '../symbols'
import { DocumentModel as ShellDocumentModel } from '../model'
import { SimulatorHost } from './simulator-host'

const innerProjectSymbol = Symbol('innerProject')

export class Project {
  get [projectSymbol]() {
    if (this.workspaceMode) {
      return this[innerProjectSymbol]
    }
    const workspace = globalContext.get('workspace')
    if (workspace.isActive) {
      if (!workspace.window?.innerProject) {
        logger.error('project api 调用时机出现问题，请检查');
        return this[innerProjectSymbol]
      }
      return workspace.window.innerProject
    }

    return this[innerProjectSymbol]
  }

  get [editorSymbol]() {
    return this[projectSymbol]?.designer.editor
  }

  constructor(project, workspaceMode = false) {
    this[innerProjectSymbol] = project
    this.workspaceMode = workspaceMode
  }

  static create(project, workspaceMode = false) {
    return new Project(project, workspaceMode)
  }

  /**
   * 获取当前的 document
   * @returns
   */
  get currentDocument() {
    return this.getCurrentDocument()
  }

  /**
   * 获取当前的 document
   * @returns
   */
  getCurrentDocument() {
    return ShellDocumentModel.create(this[projectSymbol].currentDocument)
  }

  /**
   * 获取当前 project 下所有 documents
   * @returns
   */
  get documents() {
    return this[projectSymbol].documents.map((doc) => ShellDocumentModel.create(doc))
  }

  /**
   * 获取模拟器的 host
   */
  get simulatorHost() {
    return SimulatorHost.create(this[projectSymbol].simulator || this[simulatorHostSymbol])
  }

  get simulator() {
    return this.simulatorHost
  }

  /**
   * 当前 project 的模拟器 ready 事件
   */
  onSimulatorHostReady(fn) {
    const offFn = this[projectSymbol].onSimulatorReady((simulator) => {
      fn(SimulatorHost.create(simulator))
    })
    return offFn
  }

  /**
   * 当前 project 的渲染器 ready 事件
   */
  onSimulatorRendererReady(fn) {
    const offFn = this[projectSymbol].onRendererReady(() => {
      fn()
    })
    return offFn
  }

  /**
   * 设置项目配置
   * @param value object
   * @returns
   */
  setConfig(...params) {
    if (params.length === 2) {
      const oldConfig = this[projectSymbol].get('config')
      this[projectSymbol].set('config', {
        ...oldConfig,
        [params[0]]: params[1]
      })
    } else {
      this[projectSymbol].set('config', params[0])
    }
  }
}