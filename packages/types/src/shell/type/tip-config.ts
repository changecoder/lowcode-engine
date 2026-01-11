import { IPublicTypeI18nData } from './i18n-data';
import { VueNode } from './vue-node';

export interface IPublicTypeTipConfig {
  /**
   * className
   */
  className?: string;

  /**
   * tip 的内容
   */
  children?: IPublicTypeI18nData | VueNode;
  theme?: string;

  /**
   * tip 的方向
   */
  direction?: 'top' | 'bottom' | 'left' | 'right';
}
