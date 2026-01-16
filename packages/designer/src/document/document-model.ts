import { IPublicModelDocumentModel, IPublicTypeRootSchema } from '@cc/lowcode-types';
import { INode } from './node';
import { IProject } from '../project';
import { IDesigner } from '../designer';

export interface IDocumentModel
  extends Omit<IPublicModelDocumentModel<INode, IProject>, 'getNodeById' | 'importSchema'> {
  readonly designer: IDesigner;
  get rootNode(): INode | null;
  get nodesMap(): Map<string, INode>;
  getNode(id: string): INode | null;
  import(schema: IPublicTypeRootSchema, checkId?: boolean): void;
}
