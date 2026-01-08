import { ref } from 'vue';
import { IPublicTypeWidgetBaseConfig } from '@cc/lowcode-types';
import { Logger } from '@cc/lowcode-utils';
import { IWidget } from './widget/widget';
import { ISkeleton } from './skeleton';
import { WidgetContainer } from './widget';

const logger = new Logger({ level: 'warn', bizName: 'skeleton:area' });

export interface IArea<C, T> {
  add(config: T | C): T;
  remove(config: T | string): number;
}

export class Area<C extends IPublicTypeWidgetBaseConfig = any, T extends IWidget = IWidget>
  implements IArea<C, T>
{
  readonly container: WidgetContainer<T, C>;

  private _visible = ref(true);

  get visible() {
    if (this.exclusive) {
      return this.container.current != null;
    }
    return this._visible.value;
  }

  get current() {
    if (this.exclusive) {
      return this.container.current;
    }
    return null;
  }

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
      logger.warn(`The ${config.name} has already been added to skeleton.`);
      return item;
    }
    return this.container.add(config);
  }

  remove(config: T | string): number {
    return this.container.remove(config);
  }
}
