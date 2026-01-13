import { IPublicModelNode } from '.';
import { IPublicApiProject } from '../api';
import { IPublicTypeNodeSchema, IPublicTypeRootSchema } from '../type';

export interface IPublicModelDocumentModel<Node = IPublicModelNode, Project = IPublicApiProject> {
  get id(): string;
  set id(id);
  /**
   * 获取当前文档所属的 project
   */
  get project(): Project;
  /**
   * 获取文档的根节点
   */
  get root(): Node | null;
  /**
   * 获取文档下所有节点
   */
  get nodesMap(): Map<string, Node>;
  /**
   * 根据 nodeId 返回 Node 实例
   */
  getNodeById(nodeId: string): Node | null;
  /**
   * 导入 schema
   */
  importSchema(schema: IPublicTypeRootSchema): void;
  /**
   * 创建一个节点
   */
  createNode<T = Node>(data: IPublicTypeNodeSchema): T | null;
}
