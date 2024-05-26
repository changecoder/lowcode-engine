import { IPublicModelDocumentModel } from '.'

export interface IBaseModelNode<
  Document = IPublicModelDocumentModel,
  Node = IPublicModelNode
> {
  id: string

  get isRoot(): boolean

  get isPage(): boolean

  get isComponent(): boolean
}

export interface IPublicModelNode extends IBaseModelNode<IPublicModelDocumentModel, IPublicModelNode> {}