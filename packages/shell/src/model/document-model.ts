import {
  IPublicApiProject,
  IPublicModelDocumentModel,
  IPublicModelEditor,
  IPublicModelNode,
  IPublicTypeNodeSchema,
  IPublicTypeRootSchema,
} from '@cc/lowcode-types';
import { IDocumentModel as InnerDocumentModel, INode } from '@cc/lowcode-designer';
import { documentSymbol, editorSymbol } from '../symbols';
import { Project as ShellProject } from '../api';
import { Node as ShellNode } from './node';

const shellDocSymbol = Symbol('shellDocSymbol');

export class DocumentModel implements IPublicModelDocumentModel {
  private readonly [documentSymbol]: InnerDocumentModel;
  private readonly [editorSymbol]: IPublicModelEditor;

  private _nodesMap = new Map<string, INode>();

  get id(): string {
    return this[documentSymbol].id;
  }

  set id(id) {
    this[documentSymbol].id = id;
  }

  get project(): IPublicApiProject {
    return ShellProject.create(this[documentSymbol].project);
  }

  get root(): IPublicModelNode | null {
    return ShellNode.create(this[documentSymbol].rootNode);
  }

  get nodesMap(): Map<string, IPublicModelNode> {
    const map = new Map<string, IPublicModelNode>();
    for (const id of this[documentSymbol].nodesMap.keys()) {
      map.set(id, this.getNodeById(id)!);
    }
    return map;
  }

  constructor(document: InnerDocumentModel) {
    this[documentSymbol] = document;
    this[editorSymbol] = document.designer?.editor as IPublicModelEditor;
  }

  static create(document: InnerDocumentModel | undefined | null): IPublicModelDocumentModel | null {
    if (!document) {
      return null;
    }
    if ((document as any)[shellDocSymbol]) {
      return (document as any)[shellDocSymbol];
    }
    const shellDoc = new DocumentModel(document);
    (document as any)[shellDocSymbol] = shellDoc;
    return shellDoc;
  }

  /**
   * 创建一个节点
   */
  createNode<T = IPublicModelNode>(data: IPublicTypeNodeSchema): T | null {
    return ShellNode.create(this[documentSymbol].createNode(data)) as T | null;
  }

  /**
   * 导入 schema
   */
  importSchema(schema: IPublicTypeRootSchema): void {
    this[documentSymbol].import(schema);
    this[editorSymbol].eventBus.emit('shell.document.importSchema', schema);
  }

  getNodeById(nodeId: string): IPublicModelNode | null {
    return ShellNode.create(this[documentSymbol].getNode(nodeId));
  }

  getNode(id: string): INode | null {
    return this._nodesMap.get(id) || null;
  }
}
