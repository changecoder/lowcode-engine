import { IPublicTypeCompositeValue } from './composite-value';
import { IPublicTypeNodeData } from './node-data';

export interface IPublicTypeJSExpression {
  type: 'JSExpression';
  /**
   * 表达式字符串
   */
  value: string;
  /**
   * 模拟值
   */
  mock?: any;
  /**
   * 源码
   */
  compiled?: string;
}

export interface IPublicTypeJSFunction {
  type: 'JSFunction';

  /**
   * 函数定义，或直接函数表达式
   */
  value: string;

  /**
   * 源码
   */
  compiled?: string;

  /**
   * 模拟值
   */
  mock?: any;

  /**
   * 额外扩展属性，如 extType、events
   */
  [key: string]: any;
}

export interface IPublicTypeJSSlot {
  /**
   * type
   */
  type: 'JSSlot';
  title?: string;
  id?: string;

  /**
   * 组件的某一个属性为 Function return ReactNode 时，函数的入参
   * 其子节点可以通过 this[参数名] 来获取对应的参数。
   */
  params?: string[];

  /**
   * 具体的值。
   */
  value?: IPublicTypeNodeData[] | IPublicTypeNodeData;

  /**
   * @todo 待标准描述
   */
  name?: string;
}

export type IPublicTypeDOMText = string;

export type IPublicTypeJSONValue =
  | boolean
  | string
  | number
  | null
  | undefined
  | IPublicTypeJSONArray
  | IPublicTypeJSONObject;

export type IPublicTypeJSONArray = IPublicTypeJSONValue[];

export interface IPublicTypeJSONObject {
  [key: string]: IPublicTypeJSONValue;
}

export interface IPublicTypeCompositeObject<T = IPublicTypeCompositeValue> {
  [key: string]: IPublicTypeCompositeValue | T;
}

export type IPublicTypeCompositeArray = IPublicTypeCompositeValue[];
