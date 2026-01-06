import { shallowReactive } from 'vue';

export interface WidgetItem {
  name: string;
}

export class WidgetContainer<T extends WidgetItem = any, G extends WidgetItem = any> {
  private maps: { [name: string]: T } = {};

  items: T[] = shallowReactive([]);

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

  get(name: string): T | null {
    return this.maps[name] || null;
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

    return item;
  }
}
