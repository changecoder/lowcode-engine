import { IPublicTypeCompositeValue } from './composite-value';
import { IPublicTypeNodeSchema } from './node-schema';
import {
  IPublicTypeCompositeObject,
  IPublicTypeJSExpression,
  IPublicTypeJSFunction,
} from './value-type';
import { InterpretDataSource as DataSource } from './data-source-interpret';

export interface IPublicTypeContainerSchema extends IPublicTypeNodeSchema {
  /**
   * 'Block' | 'Page' | 'Component';
   */
  componentName: string;
  fileName: string;
  meta?: Record<string, unknown>;
  /**
   * 容器初始数据
   */
  state?: {
    [key: string]: IPublicTypeCompositeValue;
  };
  /**
   * 自定义方法设置
   */
  methods?: {
    [key: string]: IPublicTypeJSExpression | IPublicTypeJSFunction;
  };
  /**
   * 生命周期对象
   */
  lifeCycles?: {
    // @todo 生命周期对象建议改为闭合集合
    [key: string]: IPublicTypeJSExpression | IPublicTypeJSFunction;
  };
  /**
   * 样式文件
   */
  css?: string;
  /**
   * 异步数据源配置
   */
  dataSource?: DataSource;
  /**
   * 低代码业务组件默认属性
   */
  defaultProps?: IPublicTypeCompositeObject;
}
