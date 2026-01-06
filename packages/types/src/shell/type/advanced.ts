import { VNode } from 'vue';
import { IPublicTypeNodeData } from '.';
import { IPublicTypeCallbacks } from './metadata';
import { IPublicModelNode } from '..';

/**
 * 高级特性配置
 */
export interface IPublicTypeAdvanced {
  /**
   * 配置 callbacks 可捕获引擎抛出的一些事件，例如 onNodeAdd、onResize 等
   * callbacks/hooks which can be used to do
   * things on some special ocations like onNodeAdd or onResize
   */
  callbacks?: IPublicTypeCallbacks;
  /**
   * 拖入容器时，自动带入 children 列表
   */
  initialChildren?: IPublicTypeNodeData[] | ((target: IPublicModelNode) => IPublicTypeNodeData[]);
  /**
   * 样式 及 位置，handle 上必须有明确的标识以便事件路由判断，或者主动设置事件独占模式
   * NWSE 是交给引擎计算放置位置，VNode 必须自己控制初始位置
   *
   * 用于配置设计器中组件 resize 操作工具的样式和内容
   * - hover 时控制柄高亮
   * - mousedown 时请求独占
   * - dragstart 请求通用 resizing 控制 请求 hud 显示
   * - drag 时 计算并设置效果，更新控制柄位置
   */
  getResizingHandlers?: (currentNode: any) =>
    | Array<{
        type: 'N' | 'W' | 'S' | 'E' | 'NW' | 'NE' | 'SE' | 'SW';
        content?: VNode;
        propTarget?: string;
        appearOn?: 'mouse-enter' | 'mouse-hover' | 'selected' | 'always';
      }>
    | VNode[];
}
