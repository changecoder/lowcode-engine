import { h, ref } from 'vue';
import { IPublicTypeTitleContent, IPublicTypeWidgetBaseConfig, VueNode } from '@cc/lowcode-types';
import { createContent, uniqueId } from '@cc/lowcode-utils';
import { ISkeleton } from '../skeleton';
import { WidgetView } from '../components/widget-views';
import { DockConfig, PanelDockConfig, WidgetConfig } from '../types';

export interface IWidget {
  readonly name: string;
  readonly skeleton: ISkeleton;
  readonly visible: boolean;
  readonly disabled?: boolean;
  readonly content: VueNode;
  readonly body: VueNode;
  readonly align?: string;
  readonly isWidget: true;
  readonly config: IPublicTypeWidgetBaseConfig;

  show(): void;
  hide(): void;
  toggle(): void;
  enable?(): void;
  disable?(): void;
}

export class Widget implements IWidget {
  readonly isWidget = true;
  readonly id = uniqueId('widget');
  readonly name: string;
  readonly align?: string;
  readonly title: IPublicTypeTitleContent;

  private inited = ref(false);
  private _visible = ref(true);
  private _disabled = ref(false);
  private _body: VueNode | undefined;

  get visible(): boolean {
    return this._visible.value;
  }

  get body() {
    if (this.inited.value) {
      return this._body;
    }
    this.inited.value = true;
    const { content, contentProps } = this.config;
    if (content) {
      this._body = createContent(content, {
        ...contentProps,
        config: this.config,
      });
    }
    return this._body;
  }

  get content(): VueNode {
    return h(WidgetView, {
      widget: this,
      key: this.id,
    });
  }

  get disabled(): boolean {
    return this._disabled.value;
  }

  constructor(readonly skeleton: ISkeleton, readonly config: WidgetConfig) {
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
}

export function isWidget(obj: any): obj is IWidget {
  return obj && obj.isWidget;
}

export function isDockConfig(obj: any): obj is DockConfig {
  return obj && /Dock$/.test(obj.type);
}

export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
  return obj && obj.type === 'PanelDock';
}
