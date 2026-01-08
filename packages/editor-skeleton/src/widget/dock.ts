import { h, ref } from 'vue';
import { IWidget } from './widget';
import { createContent, uniqueId } from '@cc/lowcode-utils';
import { ISkeleton } from '../skeleton';
import { DockConfig } from '../types';
import { VueNode } from '@cc/lowcode-types';
import { getEvent } from '@cc/lowcode-shell';
import { DockView, WidgetView } from '../components/widget-views';

export class Dock implements IWidget {
  readonly isWidget = true;
  readonly id = uniqueId('dock');
  readonly name: string;
  readonly align?: string;

  private _visible = ref(true);
  private _disabled = ref(false);
  private inited = false;
  private _body: VueNode;

  get visible(): boolean {
    return this._visible.value;
  }

  get disabled(): boolean {
    return this._disabled.value;
  }

  get content(): VueNode {
    return h(WidgetView, {
      widget: this,
      key: this.id,
    });
  }

  get body() {
    if (this.inited) {
      return this._body;
    }

    const { props, content, contentProps } = this.config;

    if (content) {
      this._body = createContent(content, {
        ...contentProps,
        config: this.config,
        editor: getEvent(this.skeleton.editor),
      });
    } else {
      this._body = h(DockView, props);
    }
    this.inited = true;

    return this._body;
  }

  constructor(readonly skeleton: ISkeleton, readonly config: DockConfig) {
    this.skeleton = skeleton;
    this.config = config;
    const { props = {}, name } = config;
    this.name = name;
    this.align = props.align;
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

  setVisible(flag: boolean) {
    if (flag === this._visible.value) {
      return;
    }
    if (flag) {
      this._visible.value = true;
    } else if (this.inited) {
      this._visible.value = false;
    }
  }

  disable() {
    this.setDisabled(true);
  }

  enable() {
    this.setDisabled(false);
  }

  getContent() {
    return this.content;
  }

  getName() {
    return this.name;
  }

  hide() {
    this.setVisible(false);
  }

  show() {
    this.setVisible(true);
  }

  toggle() {
    this.setVisible(!this._visible.value);
  }
}
