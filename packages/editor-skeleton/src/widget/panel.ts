import { VNode, h } from 'vue'
import { IPublicTypePanelConfig } from '@cc/lowcode-types'
import { IWidget, WidgetContainer } from '.'
import { ISkeleton } from '../skeleton'


export class Panel implements IWidget {
  readonly name: string
  readonly isWidget = true
  private container?: WidgetContainer<Panel, IPublicTypePanelConfig>
  
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
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel
}