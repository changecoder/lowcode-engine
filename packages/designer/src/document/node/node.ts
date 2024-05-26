import { IBaseModelNode, IPublicTypeComponentSchema, IPublicTypeNodeSchema, IPublicTypePageSchema } from '@cc/lowcode-types'
import { IDocumentModel } from '..'

export interface IBaseNode<Schema extends IPublicTypeNodeSchema = IPublicTypeNodeSchema> extends Omit<IBaseModelNode<
  IDocumentModel,
  IBaseNode
>, 
  'isRoot' |
  'isPage' |
  'isComponent'
> {
  get isPurged(): boolean
}

export type IPageNode = IBaseNode<IPublicTypePageSchema>
export type IComponentNode = IBaseNode<IPublicTypeComponentSchema>
export type IRootNode = IPageNode | IComponentNode;
export type INode = IPageNode | IComponentNode | IRootNode

export class Node<Schema extends IPublicTypeNodeSchema = IPublicTypeNodeSchema> implements IBaseNode {
  private purged = false
  /**
   * 是节点实例
   */
  readonly isNode = true
  /**
   * 节点 id
   */
  readonly id: string
  
  get isPurged(): boolean {
    return this.purged
  }

  constructor(readonly document: IDocumentModel, nodeSchema: Schema) {
    this.document = document
    const { id } = nodeSchema
    this.id = document.nextId(id)
  }
}