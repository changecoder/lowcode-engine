import { IPublicModelNode } from '.';
import { IPublicEnumTransformStage } from '../enum';
import { IPublicTypeCompositeValue } from '../type';

export interface IPublicModelProp<Node = IPublicModelNode> {
  get id(): string;
  get key(): string | number | undefined;
  get path(): string[];
  get node(): Node | null;
  /**
   * 当本 prop 代表一个 Slot 时，返回对应的 slotNode
   */
  get slotNode(): Node | undefined | null;
  setValue(val: IPublicTypeCompositeValue): void;
  getValue(): any;
  remove(): void;
  exportSchema(stage: IPublicEnumTransformStage): IPublicTypeCompositeValue;
}
