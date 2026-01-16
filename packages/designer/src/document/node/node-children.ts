import { IPublicModelNodeChildren } from '@cc/lowcode-types';
import { INode } from './node';

export interface INodeChildren
  extends Omit<
    IPublicModelNodeChildren<INode>,
    'importSchema' | 'exportSchema' | 'isEmpty' | 'notEmpty'
  > {
  children: INode[];

  get owner(): INode;
}
