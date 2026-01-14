import { IPublicModelNode, IPublicModelNodeChildren } from '@cc/lowcode-types';
import { INodeChildren } from '@cc/lowcode-designer';

import { Node as ShellNode } from './node';
import { nodeChildrenSymbol } from '../symbols';

export class NodeChildren implements IPublicModelNodeChildren {
  private readonly [nodeChildrenSymbol]: INodeChildren;

  get owner(): IPublicModelNode | null {
    return ShellNode.create(this[nodeChildrenSymbol].owner);
  }

  get size(): number {
    return this[nodeChildrenSymbol].size;
  }

  constructor(nodeChildren: INodeChildren) {
    this[nodeChildrenSymbol] = nodeChildren;
  }

  static create(nodeChildren: INodeChildren | null): IPublicModelNodeChildren | null {
    if (!nodeChildren) {
      return null;
    }
    return new NodeChildren(nodeChildren);
  }
}
