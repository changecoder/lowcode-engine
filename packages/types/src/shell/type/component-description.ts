import { IPublicTypeComponentMetadata, IPublicTypeReference } from '.';

export interface IPublicTypeComponentDescription extends IPublicTypeComponentMetadata {
  keywords: string[];
  /**
   * 替代 npm 字段的升级版本
   */
  reference?: IPublicTypeReference;
}
