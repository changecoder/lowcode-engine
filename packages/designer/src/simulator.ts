import { Point } from './designer';

export type AutoFit = '100%';

export interface IViewport {
  /**
   * 视口大小
   */
  width: number;
  height: number;
  /**
   * 内容大小
   */
  contentWidth: number | AutoFit;
  contentHeight: number | AutoFit;
  /**
   * 内容缩放
   */
  scale: number;
  /**
   * 视口矩形维度
   */
  readonly bounds: DOMRect;
  /**
   * 内容矩形维度
   */
  readonly contentBounds: DOMRect;
  /**
   * 是否滚动中
   */
  readonly scrolling: boolean;
  /**
   * 内容当前滚动 X
   */
  readonly scrollX: number;
  /**
   * 内容当前滚动 Y
   */
  readonly scrollY: number;
  /**
   * 全局坐标系转化为本地坐标系
   */
  toLocalPoint(point: Point): Point;
  /**
   * 本地坐标系转化为全局坐标系
   */
  toGlobalPoint(point: Point): Point;
}

export interface ISimulatorHost<P = object> {
  readonly isSimulator: true;
  /**
   * 获得边界维度等信息
   */
  readonly viewport: IViewport;
  // 设置 simulator Props
  setProps(props: P): void;
}
