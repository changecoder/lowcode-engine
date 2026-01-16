import {
  IBaseModelProps,
  IPublicEnumTransformStage,
  IPublicTypePropsList,
  IPublicTypePropsMap,
} from '@cc/lowcode-types';
import { INode } from '..';
import { IProp } from './prop';

export const EXTRA_KEY_PREFIX = '___';

export function getConvertedExtraKey(key: string): string {
  if (!key) {
    return '';
  }
  let _key = key;
  if (key.indexOf('.') > 0) {
    _key = key.split('.')[0];
  }
  return EXTRA_KEY_PREFIX + _key + EXTRA_KEY_PREFIX + key.slice(_key.length);
}

interface ExtrasObject {
  [key: string]: any;
}

export interface IPropParent {
  readonly props: IProps;

  readonly owner: INode;

  get path(): string[];
}

export interface IProps
  extends Omit<
      IBaseModelProps<IProp>,
      'getExtraProp' | 'getExtraPropValue' | 'setExtraPropValue' | 'node'
    >,
    IPropParent {
  /**
   * 获取 props 对应的 node
   */
  getNode(): INode;

  get(path: string, createIfNone?: boolean): IProp | null;

  export(stage?: IPublicEnumTransformStage): {
    props?: IPublicTypePropsMap | IPublicTypePropsList;
    extras?: ExtrasObject;
  };

  merge(value: IPublicTypePropsMap, extras?: IPublicTypePropsMap): void;

  purge(): void;

  query(path: string, createIfNone: boolean): IProp | null;

  import(value?: IPublicTypePropsMap | IPublicTypePropsList | null, extras?: ExtrasObject): void;
}
