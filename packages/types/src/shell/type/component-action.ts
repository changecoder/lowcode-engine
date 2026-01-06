import { IPublicTypeActionContentObject, VueNode } from '.';

export interface IPublicTypeComponentAction {
  /**
   * behaviorName
   */
  name: string;

  /**
   * 菜单名称
   */
  content: VueNode | IPublicTypeActionContentObject;

  /**
   * 子集
   */
  items?: IPublicTypeComponentAction[];

  /**
   * 显示与否
   * always: 无法禁用
   */
  condition?: boolean | ((currentNode: any) => boolean) | 'always';

  /**
   * 显示在工具条上
   */
  important?: boolean;
}
