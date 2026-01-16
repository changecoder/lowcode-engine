import { INode } from '@cc/lowcode-designer';
import { IPublicModelNode, IShellModelFactory } from '@cc/lowcode-types';
import { Node } from '@cc/lowcode-shell';

class ShellModelFactory implements IShellModelFactory {
  createNode(node: INode | null | undefined): IPublicModelNode | null {
    return Node.create(node);
  }
}
export const shellModelFactory = new ShellModelFactory();
