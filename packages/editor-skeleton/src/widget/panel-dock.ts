import { VNode, h, ref } from 'vue'
import { IWidget } from '.'
import { ISkeleton } from '../skeleton'
import { PanelDockConfig } from '../types'
import { PanelDockView } from '../components'

export class PanelDock implements IWidget {
  readonly name: string
  readonly isWidget = true
  readonly isPanelDock = true
  readonly panel: any
  private inited = false
  private _visible = ref(true)
  private _content: VNode
  get visible() {
    return this._visible.value
  }

  get content(): VNode {
    if (this.inited) {
      return this._content
    }
    this.inited = true
    const { props } = this.config
    this._content = h(PanelDockView, {
      icon: props?.icon,
      className: 'dock-view actived',
      handleClick: this.clickHandler
    })
    return this._content
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

  setVisible(flag: boolean) {
    if (flag === this._visible.value) {
      return
    }
    if (flag) {
      this._visible.value = true
    } else if (this.inited) {
      this._visible.value = false
    }
  }

  hide() {
    this.setVisible(false)
  }

  show() {
    this.setVisible(true)
  }

  toggle() {
    this.setVisible(!this._visible)
  }

  togglePanel = () => {
    this.panel?.toggle()
  }

  clickHandler = () => {
    this.togglePanel()
  }
}