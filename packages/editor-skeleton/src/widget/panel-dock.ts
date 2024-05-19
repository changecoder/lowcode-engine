import { VNode, h } from 'vue'
import { IWidget } from '.'
import { ISkeleton } from '../skeleton'
import { PanelDockConfig } from '../types'
import { PanelDockView } from '../components'

export class PanelDock implements IWidget {
  readonly name: string
  readonly isWidget = true
  readonly isPanelDock = true
  readonly panel: any

  get content(): VNode {
    const { props } = this.config
    return h(PanelDockView, {
      icon: props?.icon,
      className: 'dock-view actived',
      handleClick: this.clickHandler
    })
  }

  constructor(readonly skeleton: ISkeleton, readonly config: PanelDockConfig) {
    this.skeleton = skeleton
    const { name, content, contentProps } = config
    this.name = name
    if (content) {
      this.panel = this.skeleton.add({
        type: 'Panel',
        name: config.panelName || name,
        props: {},
        contentProps,
        content
      })
    }
  }

  togglePanel = () => {
    this.panel?.toggle()
  }

  clickHandler = () => {
    this.togglePanel()
  }
}