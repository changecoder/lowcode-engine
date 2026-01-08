import { ref, VNode, h } from 'vue';
import { uniqueId } from '@cc/lowcode-utils';
import { ISkeleton } from '../skeleton';
import { IWidget } from './widget';
import { PanelDockConfig } from '../types';
import { IPublicTypeTitleContent } from '@cc/lowcode-types';
import { PanelDockView, WidgetView } from '../components/widget-views';
import { composeTitle } from './utils';
import { Panel } from '..';

export class PanelDock implements IWidget {
  readonly isWidget = true;
  readonly isPanelDock = true;
  readonly id: string;
  readonly name: string;
  readonly align?: 'left' | 'right' | 'bottom' | 'center' | 'top' | undefined;
  readonly title: IPublicTypeTitleContent;
  readonly panelName: string;

  private _visible = ref(true);
  private inited = false;
  private _disabled = ref(false);
  private _shell = ref(null);
  private _body: VNode | undefined = undefined;
  private _panel?: Panel;

  get visible(): boolean {
    return this._visible.value;
  }

  get panel() {
    return this._panel || this.skeleton.getPanel(this.panelName);
  }

  get body() {
    if (this.inited) {
      return this._body;
    }
    this.inited = true;
    const { props } = this.config;
    this._body = h(PanelDockView, {
      ...props,
      dock: this,
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
    return this.panel?.visible || false;
  }

  constructor(readonly skeleton: ISkeleton, readonly config: PanelDockConfig) {
    this.skeleton = skeleton;
    this.config = config;
    const { props, name, content, panelProps, contentProps } = config;
    this.name = name;
    this.id = uniqueId(`dock:${name}$`);
    this.panelName = config.panelName || name;
    this.align = props?.align;
    if (content) {
      const _panelProps = { ...panelProps };
      if (_panelProps.title == null && props) {
        _panelProps.title = composeTitle(props.title, undefined, props.description, true, true);
      }
      this._panel = this.skeleton.add({
        type: 'Panel',
        name: this.panelName,
        props: _panelProps,
        contentProps,
        content,
        area: panelProps?.area,
      }) as Panel;
    }
    if (props?.onInit) {
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
    this.panel?.toggle();
  }
}
