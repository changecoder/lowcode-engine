import {
  IPublicEnumTransformStage,
  IPublicModelNode,
  IPublicModelProp,
  IPublicTypeCompositeValue,
} from '@cc/lowcode-types';
import { IProp as InnerProp } from '@cc/lowcode-designer';

import { Node as ShellNode } from './node';
import { propSymbol } from '../symbols';

export class Prop implements IPublicModelProp {
  private readonly [propSymbol]: InnerProp;

  get id(): string {
    return this[propSymbol].id;
  }

  get key(): string | number | undefined {
    return this[propSymbol].key;
  }

  get path(): string[] {
    return this[propSymbol].path;
  }

  get node(): IPublicModelNode | null {
    return ShellNode.create(this[propSymbol].getNode());
  }

  get slotNode(): IPublicModelNode | null {
    return ShellNode.create(this[propSymbol].slotNode);
  }

  get isProp(): boolean {
    return true;
  }

  constructor(prop: InnerProp) {
    this[propSymbol] = prop;
  }

  static create(prop: InnerProp | undefined | null): IPublicModelProp | null {
    if (!prop) {
      return null;
    }
    return new Prop(prop);
  }

  setValue(val: IPublicTypeCompositeValue): void {
    this[propSymbol].setValue(val);
  }

  getValue(): any {
    return this[propSymbol].getValue();
  }

  remove(): void {
    this[propSymbol].remove();
  }

  exportSchema(stage: IPublicEnumTransformStage = IPublicEnumTransformStage.Render) {
    return this[propSymbol].export(stage);
  }
}
