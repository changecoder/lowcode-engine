import { VueNode } from './vue-node';

export interface IPublicTypeI18nData {
  type: 'i18n';
  intl?: VueNode;
  [key: string]: any;
}
