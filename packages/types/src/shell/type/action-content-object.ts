import { IPublicTypeIconType, TipContent } from '.';
import { IPublicModelNode } from '../model';

/**
 * 动作描述
 */
export interface IPublicTypeActionContentObject {
  /**
   * 图标
   */
  icon?: IPublicTypeIconType;

  /**
   * 描述
   */
  title?: TipContent;

  /**
   * 执行动作
   */
  action?: (currentNode: IPublicModelNode) => void;
}
