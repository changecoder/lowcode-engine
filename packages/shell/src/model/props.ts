import {
  IPublicModelNode,
  IPublicModelProp,
  IPublicModelProps,
  IPublicTypeCompositeValue,
} from '@cc/lowcode-types';
import { IProps as InnerProps, getConvertedExtraKey } from '@cc/lowcode-designer';

import { Node as ShellNode } from './node';
import { Prop as ShellProp } from './prop';
import { propsSymbol } from '../symbols';

export class Props implements IPublicModelProps {
  private readonly [propsSymbol]: InnerProps;

  get id(): string {
    return this[propsSymbol].id;
  }

  get path(): string[] {
    return this[propsSymbol].path;
  }

  get node(): IPublicModelNode | null {
    return ShellNode.create(this[propsSymbol].getNode());
  }

  constructor(props: InnerProps) {
    this[propsSymbol] = props;
  }

  static create(props: InnerProps | undefined | null): IPublicModelProps | null {
    if (!props) {
      return null;
    }
    return new Props(props);
  }

  /**
   * 获取指定 path 的属性模型实例
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getProp(path: string): IPublicModelProp | null {
    return ShellProp.create(this[propsSymbol].getProp(path));
  }

  /**
   * 获取指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getPropValue(path: string): any {
    return this.getProp(path)?.getValue();
  }

  /**
   * 获取指定 path 的属性模型实例，
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getExtraProp(path: string): IPublicModelProp | null {
    return ShellProp.create(this[propsSymbol].getProp(getConvertedExtraKey(path)));
  }

  /**
   * 获取指定 path 的属性模型实例值
   *  注：导出时，不同于普通属性，该属性并不挂载在 props 之下，而是与 props 同级
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   */
  getExtraPropValue(path: string): any {
    return this.getExtraProp(path)?.getValue();
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   */
  setPropValue(path: string, value: IPublicTypeCompositeValue): void {
    return this.getProp(path)?.setValue(value);
  }

  /**
   * 设置指定 path 的属性模型实例值
   * @param path 属性路径，支持 a / a.b / a.0 等格式
   * @param value 值
   */
  setExtraPropValue(path: string, value: IPublicTypeCompositeValue): void {
    return this.getExtraProp(path)?.setValue(value);
  }

  /**
   * test if the specified key is existing or not.
   * @param key
   */
  has(key: string): boolean {
    return this[propsSymbol].has(key);
  }

  /**
   * add a key with given value
   * @param value
   * @param key
   */
  add(value: IPublicTypeCompositeValue, key?: string | number | undefined): any {
    return this[propsSymbol].add(value, key);
  }
}
