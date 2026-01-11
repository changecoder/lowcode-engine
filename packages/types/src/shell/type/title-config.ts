import { IPublicTypeI18nData } from './i18n-data';
import { IPublicTypeIconType } from './icon-type';
import { TipContent } from './tip-content';
import { IPublicTypeTitleContent } from './title-content';
import { VueNode } from './vue-node';

/**
 * 描述 props 的 setter title
 */
export interface IPublicTypeTitleConfig {
  /**
   * 文字描述
   */
  label?: IPublicTypeI18nData | VueNode;

  /**
   * hover 后的展现内容
   */
  tip?: TipContent;

  /**
   * 文档链接，暂未实现
   */
  docUrl?: string;

  /**
   * 图标
   */
  icon?: IPublicTypeIconType;

  /**
   * CSS 类
   */
  className?: string;
}

export interface IPublicTypeTitleProps {
  /**
   * 标题内容
   */
  title: IPublicTypeTitleContent;

  /**
   * className
   */
  className?: string;

  /**
   * 点击事件
   */
  onClick?: (e: MouseEvent) => void;
  match?: boolean;
  keywords?: string;
}
