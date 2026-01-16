import { IBaseModelNode } from '@cc/lowcode-types';
import { IDocumentModel, INodeChildren, IProp, IProps } from '..';

export interface IBaseNode
  extends Omit<IBaseModelNode<IDocumentModel, IBaseNode, INodeChildren, IProps, IProp>, 'visible'> {
  isNode: boolean;
  get index(): number | undefined;
}

export type ISlotNode = IBaseNode;
export type IPageNode = IBaseNode;
export type IComponentNode = IBaseNode;
export type IRootNode = IPageNode | IComponentNode;
export type INode = IPageNode | ISlotNode | IComponentNode | IRootNode;
