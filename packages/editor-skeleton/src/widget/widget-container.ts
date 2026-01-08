import { ref, shallowReactive } from 'vue';
import { hasOwnProperty } from '@cc/lowcode-utils';
import { isPanel } from './panel';

export interface Activeable {
  setActive(flag: boolean): void;
}

export interface WidgetItem {
  name: string;
}

function isActiveable(obj: any): obj is Activeable {
  return obj && obj.setActive;
}

export class WidgetContainer<T extends WidgetItem = any, G extends WidgetItem = any> {
  private maps: { [name: string]: T } = {};
  private _current = ref<(T & Activeable) | null>(null);

  items: T[] = shallowReactive([]);

  get current(): (T & Activeable) | null {
    return this._current.value;
  }

  get visible() {
    return this.checkVisible();
  }

  constructor(
    readonly name: string,
    private handle: (item: T | G) => T,
    private exclusive: boolean = false,
    private checkVisible: () => boolean = () => true,
    private defaultSetCurrent: boolean = false
  ) {
    this.name = name;
    this.handle = handle;
    this.exclusive = exclusive;
    this.checkVisible = checkVisible;
    this.defaultSetCurrent = defaultSetCurrent;
  }

  active(nameOrItem?: T | string | null) {
    let item: any = nameOrItem;
    if (nameOrItem && typeof nameOrItem === 'string') {
      item = this.get(nameOrItem);
    }
    if (!isActiveable(item)) {
      item = null;
    }

    if (this.exclusive) {
      if (this.current === item) {
        return;
      }
      if (this.current) {
        this.current.setActive(false);
      }
      this._current.value = item;
    }

    if (item) {
      item.setActive(true);
    }
  }

  unactive(nameOrItem?: T | string | null) {
    let item: any = nameOrItem;
    if (nameOrItem && typeof nameOrItem === 'string') {
      item = this.get(nameOrItem);
    }
    if (!isActiveable(item)) {
      item = null;
    }
    if (this.current === item) {
      this._current.value = null;
    }
    if (item) {
      item.setActive(false);
    }
  }

  unactiveAll() {
    Object.keys(this.maps).forEach(name => this.unactive(name));
  }

  get(name: string): T | null {
    return this.maps[name] || null;
  }

  getAt(index: number): T | null {
    return this.items[index] || null;
  }

  has(name: string): boolean {
    return hasOwnProperty(this.maps, name);
  }

  indexOf(item: T): number {
    return this.items.indexOf(item);
  }

  add(item: T | G): T {
    item = this.handle(item);
    const origin = this.get(item.name);
    if (origin === item) {
      return origin;
    }
    const i = origin ? this.items.indexOf(origin) : -1;
    if (i > -1) {
      this.items[i] = item;
    } else {
      this.items.push(item);
    }
    this.maps[item.name] = item;
    if (isPanel(item)) {
      item.setParent(this);
    }
    if (this.defaultSetCurrent) {
      const shouldHiddenWhenInit = (item as any).config?.props?.hiddenWhenInit;
      if (!this.current && !shouldHiddenWhenInit) {
        this.active(item);
      }
    }
    return item;
  }

  remove(item: string | T): number {
    const thing = typeof item === 'string' ? this.get(item) : item;
    if (!thing) {
      return -1;
    }
    const i = this.items.indexOf(thing);
    if (i > -1) {
      this.items.splice(i, 1);
    }
    delete this.maps[thing.name];
    if (thing === this.current) {
      this._current.value = null;
    }
    return i;
  }
}
