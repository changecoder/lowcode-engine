import { VNode } from 'vue';
import {
  IPublicTypeNodeSchema,
  IPublicModelDocumentModel,
  IPublicModelNode,
  IPublicTypeI18nData,
  IPublicTypeIconType,
  IPublicModelNodeChildren,
  IPublicModelProps,
  IPublicTypePropsMap,
  IPublicTypePropsList,
  IPublicModelProp,
} from '@cc/lowcode-types';
import { IDocumentModel as InnerDocumentModel, INode as InnerNode } from '@cc/lowcode-designer';
import { documentSymbol, nodeSymbol } from '../symbols';
import { DocumentModel as ShellDocumentModel } from './document-model';
import { NodeChildren as ShellNodeChildren } from './node-children';
import { Props as ShellProps } from './props';
import { Prop as ShellProp } from './prop';

const shellNodeSymbol = Symbol('shellNodeSymbol');

function isShellNode(node: any): node is IPublicModelNode {
  return node[shellNodeSymbol];
}

export class Node implements IPublicModelNode {
  private readonly [documentSymbol]: InnerDocumentModel | null;
  private readonly [nodeSymbol]: InnerNode;
  private _id: string;

  readonly isNode = true;

  get id() {
    return this._id;
  }

  set id(id: string) {
    this._id = id;
  }

  get title(): string | IPublicTypeI18nData | VNode {
    return this[nodeSymbol].title;
  }

  /**
   * 是否为「容器型」节点
   */
  get isContainerNode(): boolean {
    return this[nodeSymbol].isContainerNode;
  }

  /**
   * 是否为根节点
   */
  get isRootNode(): boolean {
    return this[nodeSymbol].isRootNode;
  }

  /**
   * 是否为空节点（无 children 或者 children 为空）
   */
  get isEmptyNode(): boolean {
    return this[nodeSymbol].isEmptyNode;
  }

  /**
   * 是否为 Page 节点
   */
  get isPageNode(): boolean {
    return this[nodeSymbol].isPageNode;
  }

  /**
   * 是否为 Component 节点
   */
  get isComponentNode(): boolean {
    return this[nodeSymbol].isComponentNode;
  }

  /**
   * 是否为「模态框」节点
   */
  get isModalNode(): boolean {
    return this[nodeSymbol].isModalNode;
  }

  /**
   * 是否为插槽节点
   */
  get isSlotNode(): boolean {
    return this[nodeSymbol].isSlotNode;
  }

  /**
   * 是否为父类/分支节点
   */
  get isParentalNode(): boolean {
    return this[nodeSymbol].isParentalNode;
  }

  /**
   * 是否为叶子节点
   */
  get isLeafNode(): boolean {
    return this[nodeSymbol].isLeafNode;
  }

  /**
   * 获取当前节点的锁定状态
   */
  get isLocked(): boolean {
    return this[nodeSymbol].isLocked;
  }

  /**
   * 下标
   */
  get index() {
    return this[nodeSymbol].index;
  }

  /**
   * 图标
   */
  get icon(): IPublicTypeIconType {
    return this[nodeSymbol].icon;
  }

  /**
   * 节点所在树的层级深度，根节点深度为 0
   */
  get zLevel(): number {
    return this[nodeSymbol].zLevel;
  }

  /**
   * 节点 componentName
   */
  get componentName(): string {
    return this[nodeSymbol].componentName;
  }

  /**
   * 获取节点所属的文档模型对象
   */
  get document(): IPublicModelDocumentModel | null {
    return ShellDocumentModel.create(this[documentSymbol]);
  }

  /**
   * 获取当前节点的父亲节点
   * @returns
   */
  get parent(): IPublicModelNode | null {
    return Node.create(this[nodeSymbol].parent);
  }

  /**
   * 获取当前节点的孩子节点模型
   * @returns
   */
  get children(): IPublicModelNodeChildren | null {
    return ShellNodeChildren.create(this[nodeSymbol].children);
  }

  /**
   * 节点上挂载的插槽节点们
   */
  get slots(): IPublicModelNode[] {
    return this[nodeSymbol].slots.map((node: InnerNode) => Node.create(node)!);
  }

  /**
   * 当前节点为插槽节点时，返回节点对应的属性实例
   */
  get slotFor(): IPublicModelProp | null | undefined {
    return ShellProp.create(this[nodeSymbol].slotFor);
  }

  /**
   * 返回节点的属性集
   */
  get props(): IPublicModelProps | null {
    return ShellProps.create(this[nodeSymbol].props);
  }

  /**
   * 返回节点的属性集
   */
  get propsData(): IPublicTypePropsMap | IPublicTypePropsList | null {
    return this[nodeSymbol].propsData;
  }

  /**
   * 获取符合搭建协议 - 节点 schema 结构
   */
  get schema(): IPublicTypeNodeSchema {
    return this[nodeSymbol].schema;
  }

  /**
   * 获取磁贴布局节点设置状态
   */
  get isRGLContainerNode() {
    return this[nodeSymbol].isRGLContainerNode;
  }

  constructor(node: InnerNode) {
    this[nodeSymbol] = node;
    this[documentSymbol] = node.document;

    this._id = this[nodeSymbol].id;
  }

  static create(node: InnerNode | IPublicModelNode | null | undefined): IPublicModelNode | null {
    if (!node) {
      return null;
    }

    if (isShellNode(node)) {
      return (node as any)[shellNodeSymbol];
    }
    const shellNode = new Node(node);

    // @ts-expect-error 挂载 shell node 实例
    node[shellNodeSymbol] = shellNode;
    return shellNode;
  }
}
