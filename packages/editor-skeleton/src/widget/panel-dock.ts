import { ref, VNode, h } from 'vue';
import { uniqueId } from '@cc/lowcode-utils';
import { ISkeleton } from '../skeleton';
import { IWidget } from './widget';
import { WidgetConfig } from '../types';
import { IPublicTypeTitleContent } from '@cc/lowcode-types';
import { PanelDockView, WidgetView } from '../components/widget-views';

export class PanelDock implements IWidget {
  readonly isWidget = true;
  readonly isPanelDock = true;
  readonly id = uniqueId('widget');
  readonly name: string;
  readonly align?: 'left' | 'right' | 'bottom' | 'center' | 'top' | undefined;
  readonly title: IPublicTypeTitleContent;

  private _visible = ref(true);
  private inited = false;
  private _disabled = ref(false);
  private _shell = ref(null);
  private _body: VNode | undefined = undefined;

  get visible(): boolean {
    return this._visible.value;
  }

  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
    const { props } = this.config;
    this._body = h(PanelDockView, {
      ...props,
      config: this.config,
    });
    return this._body;
  }

  get content(): VNode {
    return h(WidgetView, {
      widget: this,
      ref: this._shell,
      key: this.id,
    });
  }

  get disabled(): boolean {
    return this._disabled.value;
  }

  get actived(): boolean {
    // to do
    return true;
  }

  constructor(
    readonly skeleton: ISkeleton,
    readonly config: WidgetConfig
  ) {
    this.skeleton = skeleton;
    this.config = config;
    const { props = {}, name } = config;
    this.name = name;
    this.title = props.title || name;
    if (props.onInit) {
      props.onInit.call(this, this);
    }
  }

  private setDisabled(flag: boolean) {
    if (this._disabled.value === flag) {
      return;
    }
    this._disabled.value = flag;
  }

  private setVisible(flag: boolean) {
    if (flag === this._visible.value) {
      return;
    }
    if (flag) {
      this._visible.value = true;
    } else if (this.inited) {
      this._visible.value = false;
    }
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  toggle() {
    this.setVisible(!this._visible);
  }

  disable() {
    this.setDisabled(true);
  }

  enable() {
    this.setDisabled(false);
  }

  togglePanel() {
    // todo
  }
}
