import { h, ref } from 'vue';
import {
  IPublicTypeWidgetBaseConfig,
  IEventBus,
  IPublicTypePanelConfig,
  IPublicTypeTitleContent,
  VueNode,
} from '@cc/lowcode-types';
import { createModuleEventBus } from '@cc/lowcode-editor-core';
import { ISkeleton, IWidget, WidgetContainer } from '..';
import { createContent, uniqueId } from '@cc/lowcode-utils';
import { composeTitle } from './utils';

import { getEvent } from '@cc/lowcode-shell';
import { PanelView, TitledPanelView } from '../components/widget-views';

export class Panel implements IWidget {
  readonly isWidget = true;
  readonly isPanel = true;
  readonly name: string;
  readonly id: string;
  readonly config: IPublicTypeWidgetBaseConfig;
  readonly title: IPublicTypeTitleContent;
  readonly skeleton: ISkeleton;

  private _inited = ref(false);
  private _actived = ref(false);
  private plain = false;
  private emitter: IEventBus = createModuleEventBus('Panel');
  private container?: WidgetContainer<Panel, IPublicTypePanelConfig>;

  public _parent = ref<WidgetContainer>();

  get parent() {
    return this._parent.value;
  }

  get actived(): boolean {
    return this._actived.value;
  }

  get inited(): boolean {
    return this._inited.value;
  }

  get visible(): boolean {
    if (!this.parent || this.parent.visible) {
      const { props } = this.config;
      if (props?.condition) {
        return props.condition(this);
      }
      return this._actived.value;
    }
    return false;
  }

  get body() {
    if (this.container) {
      console.warn('container 待处理');
    }

    const { content, contentProps } = this.config;
    return createContent(content, {
      ...contentProps,
      editor: getEvent(this.skeleton.editor),
      config: this.config,
      panel: this,
      pane: this,
    });
  }

  get content(): VueNode {
    const area = this.config?.area || this.parent?.name;
    if (this.plain) {
      return h(PanelView, {
        panel: this,
        key: this.id,
        area,
      });
    }
    return h(TitledPanelView, { panel: this, key: this.id, area });
  }

  constructor(skeleton: ISkeleton, config: IPublicTypeWidgetBaseConfig) {
    this.skeleton = skeleton;
    this.config = config;
    const { name, content, props = {} } = config;
    const { hideTitleBar, title, icon, description } = props;
    this.name = name;
    this.id = uniqueId(`pane:${name}$`);
    this.title = composeTitle(title || name, icon, description);
    this.plain = hideTitleBar || !title;
    if (Array.isArray(content)) {
      this.container = this.skeleton.createContainer(
        name,
        item => {
          if (isPanel(item)) {
            return item;
          }
          return this.skeleton.createPanel(item);
        },
        true,
        () => this.visible,
        true
      );
      content.forEach(item => this.add(item));
    }
    if (props.onInit) {
      props.onInit.call(this, this);
    }
    if (typeof content !== 'string' && content && content.onInit) {
      console.warn('content 类型异常', content);
    }
  }

  setParent(parent: WidgetContainer) {
    if (parent === this.parent) {
      return;
    }
    if (this.parent) {
      this.parent.remove(this);
    }
    this._parent.value = parent;
  }

  setActive(flag: boolean) {
    if (flag === this.actived) {
      // TODO: 如果移动到另外一个 container，会有问题
      return;
    }
    if (flag) {
      // 对于 Area 的直接 Child，要专门处理 Float & Fixed 分组切换, 其他情况不需要
      if (this.isChildOfFloatArea()) {
        this.skeleton.leftFixedArea.container.unactiveAll();
      } else if (this.isChildOfFixedArea()) {
        this.skeleton.leftFloatArea.container.unactiveAll();
      }
      this._actived.value = true;
      this.parent?.active(this);
      if (!this.inited) {
        this._inited.value = true;
      }
      this.emitter.emit('activechange', true);
    } else if (this.inited) {
      if (this.parent?.name && this.name.startsWith(this.parent.name)) {
        this._inited.value = false;
      }
      this._actived.value = false;
      this.parent?.unactive(this);
      this.emitter.emit('activechange', false);
    }
  }

  add(item: Panel | IPublicTypePanelConfig) {
    return this.container?.add(item);
  }

  getPane(name: string): Panel | null {
    return this.container?.get(name) || null;
  }

  remove(item: Panel | string) {
    return this.container?.remove(item);
  }

  active(item?: Panel | string | null) {
    if (item) {
      this.container?.active(item);
    } else {
      this.setActive(true);
    }
  }

  getName() {
    return this.name;
  }

  getContent() {
    return this.content;
  }

  isChildOfFloatArea(): boolean {
    return this.parent?.name === 'leftFloatArea';
  }

  isChildOfFixedArea(): boolean {
    return this.parent?.name === 'leftFixedArea';
  }

  toggle() {
    this.setActive(!this.actived);
  }

  hide() {
    this.setActive(false);
  }

  disable() {}

  enable(): void {}

  show() {
    this.setActive(true);
  }
}

export function isPanel(obj: any): obj is Panel {
  return obj && obj.isPanel;
}
