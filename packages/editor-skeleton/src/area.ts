import { ref } from 'vue';
import { IPublicTypeWidgetBaseConfig } from '@cc/lowcode-types';
import { IWidget } from './widget/widget';
import { ISkeleton } from './skeleton';
import { WidgetContainer } from './widget';

export interface IArea<C, T> {
  add(config: T | C): T;
}

export class Area<
  C extends IPublicTypeWidgetBaseConfig = any,
  T extends IWidget = IWidget,
> implements IArea<C, T> {
  private _visible = ref(true);

  get visible() {
    return this._visible.value;
  }

  readonly container: WidgetContainer<T, C>;
  constructor(
    readonly skeleton: ISkeleton,
    readonly name: string,
    handle: (item: T | C) => T,
    private exclusive?: boolean,
    defaultSetCurrent = false
  ) {
    this.skeleton = skeleton;
    this.name = name;
    this.container = skeleton.createContainer(
      name,
      handle,
      exclusive,
      () => this.visible,
      defaultSetCurrent
    );
  }

  add(config: C | T): T {
    const item = this.container.get(config.name);
    if (item) {
      console.warn(`The ${config.name} has already been added to skeleton.`);
      return item;
    }
    return this.container.add(config);
  }
}
