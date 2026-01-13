import { VNode } from 'vue';
import {
  IPublicTypeI18nData,
  IPublicTypeIconType,
  IPublicTypeNodeSchema,
  IPublicTypePropsList,
  IPublicTypePropsMap,
} from '../type';
import { IPublicModelDocumentModel } from './document-model';
import { IPublicModelNodeChildren, IPublicModelProps } from '.';

export interface IBaseModelNode<
  Document = IPublicModelDocumentModel,
  Node = IPublicModelNode,
  NodeChildren = IPublicModelNodeChildren,
  Props = IPublicModelProps
> {
  /**
   * 节点 id
   */
  id: string;
  /**
   * 下标
   */
  get index(): number | undefined;
  /**
   * 图标
   */
  get icon(): IPublicTypeIconType;
  /**
   * 节点所在树的层级深度，根节点深度为 0
   */
  get zLevel(): number;
  /**
   * 节点 componentName
   */
  get componentName(): string;
  /**
   * 获取节点所属的文档模型对象
   */
  get document(): Document | null;
  /**
   * 获取当前节点的父亲节点
   */
  get parent(): Node | null;
  /**
   * 获取当前节点的孩子节点模型
   */
  get children(): NodeChildren | null;
  /**
   * 节点上挂载的插槽节点们
   * get slots of this node
   */
  get slots(): Node[];
  /**
   * 返回节点的属性集
   */
  get props(): Props | null;
  /**
   * 返回节点的属性集
   */
  get propsData(): IPublicTypePropsMap | IPublicTypePropsList | null;
  /**
   * 获取符合搭建协议 - 节点 schema 结构
   */
  get schema(): IPublicTypeNodeSchema;
  /**
   * 节点标题
   */
  get title(): string | IPublicTypeI18nData | VNode;
  get isContainerNode(): boolean;
  get isRootNode(): boolean;
  get isEmptyNode(): boolean;
  get isPageNode(): boolean;
  get isComponentNode(): boolean;
  get isModalNode(): boolean;
  get isSlotNode(): boolean;
  get isParentalNode(): boolean;
  get isLeafNode(): boolean;
  get isLocked(): boolean;
  get isRGLContainerNode(): boolean;
}

export type IPublicModelNode = IBaseModelNode<IPublicModelDocumentModel, IPublicModelNode>;
