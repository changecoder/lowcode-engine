import { VNode, h } from 'vue'
import { IPublicTypePanelConfig } from '@cc/lowcode-types'
import { IWidget, WidgetContainer } from '.'
import { ISkeleton } from '../skeleton'
import { IEventBus, createModuleEventBus } from '@cc/lowcode-editor-core'


export class Panel implements IWidget {
  readonly name: string
  readonly isWidget = true
  readonly isPanel = true
  private container?: WidgetContainer<Panel, IPublicTypePanelConfig>
  private actived = false
  private emitter: IEventBus = createModuleEventBus('Panel')
  parent?: WidgetContainer

  get content(): VNode {
    const { content, contentProps = {} } = this.config
    return h(content, {
      ...contentProps,
      config: this.config,
      editor: this.skeleton.editor
    })
  }
  
  constructor(readonly skeleton: ISkeleton, readonly config: IPublicTypePanelConfig) {
    this.skeleton = skeleton
    const { name, content } = config
    this.name = name
    if (Array.isArray(content)) {
      this.container = this.skeleton.createContainer(
        name,
        (item) => {
          if (isPanel(item)) {
            return item
          }
          return this.skeleton.createPanel(item)
        }
      )
      content.forEach((item) => this.add(item))
    }
  }

  add(item: Panel | IPublicTypePanelConfig) {
    return this.container?.add(item)
  }

  setActive(flag: boolean) {
    if (flag === this.actived) {
      return
    }
    this.actived = flag
    if (flag) {
      this.parent?.active(this)
      this.emitter.emit('activechange', true)
    } else {
      this.parent?.unactive(this)
      this.emitter.emit('activechange', false)
    }
  }

  setParent(parent: WidgetContainer) {
    if (parent === this.parent) {
      return
    }
    if (this.parent) {
      this.parent.remove(this)
    }
    this.parent = parent
  }

  toggle() {
    this.setActive(!this.actived)
  }

  hide() {
    this.setActive(false)
  }

  show() {
    this.setActive(true)
  }

  isChildOfFloatArea(): boolean {
    return this.parent?.name === 'leftFloatArea'
  }

  isChildOfFixedArea(): boolean {
    return this.parent?.name === 'leftFixedArea'
  }
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel
}