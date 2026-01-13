import { IPublicModelNode } from '.';

export interface IBaseModelProps {
  get id(): string;
  /**
   * 返回当前 props 的路径
   */
  get path(): string[];
  /**
   * 返回所属的 node 实例
   */
  get node(): IPublicModelNode | null;
}

export type IPublicModelProps = IBaseModelProps;
