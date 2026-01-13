import { IPublicModelNode } from '.';

export interface IPublicModelNodeChildren<Node = IPublicModelNode> {
  /**
   * 返回当前 children 实例所属的节点实例
   */
  get owner(): Node | null;
  /**
   * children 内的节点实例数
   */
  get size(): number;
}
