import { IPublicTypeI18nData } from './i18n-data';
import { IPublicTypeNodeSchema } from './node-schema';
import { IPublicTypeDOMText, IPublicTypeJSExpression } from './value-type';

export type IPublicTypeNodeData =
  | IPublicTypeNodeSchema
  | IPublicTypeJSExpression
  | IPublicTypeDOMText
  | IPublicTypeI18nData;
