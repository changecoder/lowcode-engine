import { globalContext } from '@cc/lowcode-editor-core'

import { dragonSymbol, nodeSymbol } from '../symbols'
import { DragObject } from './drag-object'
import LocateEvent from './locate-event'

export const innerDragonSymbol = Symbol('innerDragonSymbol')

export class Dragon {
  constructor(innerDragon, workspaceMode) {
    this[innerDragonSymbol] = innerDragon
    this.workspaceMode = workspaceMode
  }

  get [dragonSymbol]() {
    if (this.workspaceMode) {
      return this[innerDragonSymbol]
    }
    const workspace = globalContext.get('workspace')
    let editor = globalContext.get('editor')

    if (workspace.isActive) {
      editor = workspace.window.editor
    }

    const designer = editor.get('designer')
    return designer.dragon
  }

  static create(
    dragon,
    workspaceMode
  ) {
    if (!dragon) {
      return null
    }
    return new Dragon(dragon, workspaceMode)
  }

  get dragging() {
    return this[dragonSymbol].dragging;
  }

  /**
   * 绑定 dragstart 事件
   * @param func
   * @returns
   */
  onDragstart(func) {
    return this[dragonSymbol].onDragstart(e => func(LocateEvent.create(e)))
  }

  /**
   * 绑定 drag 事件
   * @param func
   * @returns
   */
  onDrag(func) {
    return this[dragonSymbol].onDrag(e => func(LocateEvent.create(e)))
  }

  /**
   * 绑定 dragend 事件
   * @param func
   * @returns
   */
  onDragend(func) {
    return this[dragonSymbol].onDragend(
      (o) => {
        const dragObject = DragObject.create(o.dragObject)
        const { copy } = o
        return func({ dragObject: dragObject, copy })
      }
    )
  }

  /**
   * 设置拖拽监听的区域 shell，以及自定义拖拽转换函数 boost
   * @param shell 拖拽监听的区域
   * @param boost 拖拽转换函数
   */
  from(shell, boost) {
    return this[dragonSymbol].from(shell, boost)
  }

  /**
   * boost your dragObject for dragging(flying) 发射拖拽对象
   *
   * @param dragObject 拖拽对象
   * @param boostEvent 拖拽初始时事件
   */
  boost(dragObject, boostEvent, fromRglNode) {
    return this[dragonSymbol].boost({
      ...dragObject,
      nodes: dragObject.nodes.map(node => node[nodeSymbol])
    }, boostEvent, fromRglNode?.[nodeSymbol])
  }

  /**
   * 添加投放感应区
   */
  addSensor(sensor) {
    return this[dragonSymbol].addSensor(sensor)
  }

  /**
   * 移除投放感应
   */
  removeSensor(sensor) {
    return this[dragonSymbol].removeSensor(sensor)
  }
}