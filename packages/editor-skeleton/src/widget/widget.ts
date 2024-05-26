import { VNode, h } from 'vue'
import { ISkeleton } from '../skeleton'
import { WidgetConfig } from '../types'

export interface IWidget {
  readonly name: string
  readonly skeleton: ISkeleton
  readonly content: any
  readonly align?: string
  show(): void
  hide(): void
  toggle(): void
}

export function isWidget(obj: any): obj is IWidget {
  return obj && obj.isWidget
}

export class Widget implements IWidget {
  readonly name: string
  readonly isWidget = true
  readonly align?: string
  
  get content(): VNode {
    const { content, contentProps = {} } = this.config
    return h(content, {
      ...contentProps,
      config: this.config
    })
  }

  constructor(readonly skeleton: ISkeleton, readonly config: WidgetConfig) {
    this.skeleton = skeleton
    this.config = config
    const { name, props = {} } = config
    this.name = name
    this.align = props.align
  }
  show(): void {
    throw new Error('Method not implemented.')
  }
  hide(): void {
    throw new Error('Method not implemented.')
  }
  toggle(): void {
    throw new Error('Method not implemented.')
  }
}