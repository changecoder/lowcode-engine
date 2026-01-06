import { IPublicTypeTitleConfig } from '@cc/lowcode-types';
import { isI18nData, isPlainObject } from '.';

export function isTitleConfig(obj: any): obj is IPublicTypeTitleConfig {
  return isPlainObject(obj) && !isI18nData(obj);
}
