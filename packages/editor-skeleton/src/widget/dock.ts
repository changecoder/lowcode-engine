import { VNode, h } from 'vue'
import { IWidget } from '.'
import { ISkeleton } from '../skeleton'
import { DockConfig } from '../types'

export class Dock implements IWidget {
  readonly name: string
  readonly isWidget = true

  get content(): VNode {
    const { content, contentProps = {} } = this.config
    return h(content, {
      ...contentProps,
      config: this.config
    })
  }
  
  constructor(readonly skeleton: ISkeleton, readonly config: DockConfig) {
    this.skeleton = skeleton
    const { name } = config
    this.name = name
  }
}