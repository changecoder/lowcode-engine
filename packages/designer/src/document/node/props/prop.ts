import {
  IPublicEnumTransformStage,
  IPublicModelProp,
  IPublicTypeCompositeValue,
} from '@cc/lowcode-types';
import { INode } from '..';
import { IPropParent, IProps } from './props';

export interface IProp extends Omit<IPublicModelProp<INode>, 'exportSchema' | 'node'>, IPropParent {
  readonly props: IProps;
  readonly owner: INode;

  key: string | number | undefined;

  get size(): number;

  getNode(): INode;

  export(stage: IPublicEnumTransformStage): IPublicTypeCompositeValue;
}
