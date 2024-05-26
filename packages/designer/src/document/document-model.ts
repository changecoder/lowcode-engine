import { isDOMText, isJSExpression, uniqueId } from '@cc/lowcode-utils'
import { IPublicTypeRootSchema } from '@cc/lowcode-types'
import { IEventBus, createModuleEventBus } from '@cc/lowcode-editor-core'
import { IDesigner, INode, IProject, IRootNode, Node } from '..'

export interface IDocumentModel {
  get id(): string

  set id(id)

  readonly designer: IDesigner
  
  get active(): boolean

  export(stage: string): IPublicTypeRootSchema | undefined

  open(): IDocumentModel

  remove(): void

  nextId(possibleId: string | undefined): string
}

export class DocumentModel implements IDocumentModel {
  /**
   * 文档编号
   */
  id: string = uniqueId('doc')
  /**
   * 根节点 类型有：Page/Component/Block
   */
  rootNode: IRootNode | null
  private _nodesMap = new Map<string, INode>()
  private nodes = new Set<INode>()
  private _opened = false
  private _suspensed = false
  private emitter: IEventBus
  private _blank?: boolean
  private inited = false
  private seqId = 0
  readonly designer: IDesigner
  readonly project: IProject

  get active(): boolean {
    return !this._suspensed
  }

  get nodesMap(): Map<string, INode> {
    return this._nodesMap
  }

  constructor(project: IProject, schema?: IPublicTypeRootSchema) {
    this.project = project
    this.designer = this.project?.designer
    this.emitter = createModuleEventBus('DocumentModel')

    if (!schema) {
      this._blank = true
    }
    this.id = project.getSchema()?.id || this.id
    this.rootNode = this.createNode(
      schema || {
        componentName: 'Page',
        id: 'root',
        fileName: ''
      }
    )
    this.inited = true
  }

  /**
   * 根据 schema 创建一个节点
   */
  createNode(data: any): any {
    let schema: any
    if (isDOMText(data) || isJSExpression(data)) {
      schema = {
        componentName: 'Leaf',
        children: data
      }
    } else {
      schema = data
    }
    let node: INode | null = null
    if (this.hasNode(schema?.id)) {
      schema.id = null;
    }
    if (schema.id) {
      node = this.getNode(schema.id)
      console.log(node)
    }
    if (!node) {
      node = new Node(this, schema)
    }

    this._nodesMap.set(node.id, node)
    this.nodes.add(node)

    this.emitter.emit('nodecreate', node)
    return node as any
  }
  /**
   * 切换激活，只有打开的才能激活
   * 不激活，打开之后切换到另外一个时发生，比如 tab 视图，切换到另外一个标签页
   */
  private setSuspense(flag: boolean) {
    if (!this._opened && !flag) {
      return
    }
    this._suspensed = flag
  }

  /**
   * 打开，已载入，默认建立时就打开状态，除非手动关闭
   */
  open(): DocumentModel {
    this._opened = true
    if (this._suspensed) {
      this.setSuspense(false)
    }
    return this
  }

  /**
   * 从项目中移除
   */
  remove() {
    this.designer.postEvent('document.remove', { id: this.id })
    this.project.removeDocument(this)
  }

  export(stage: string = 'serilize'): IPublicTypeRootSchema | undefined {
    return {} as any
  }

  getNode(id: string): INode | null {
    return this._nodesMap.get(id) || null
  }

  hasNode(id: string): boolean {
    const node = this.getNode(id)
    return node ? !node.isPurged : false
  }

  /**
   * 生成唯一 id
   */
  nextId(possibleId: string | undefined): string {
    let id = possibleId
    while (!id || this.nodesMap.get(id)) {
      id = `node_${(String(this.id).slice(-10) + (++this.seqId).toString(36)).toLocaleLowerCase()}`
    }

    return id
  }
}

export function isDocumentModel(obj: any): obj is IDocumentModel {
  return obj && obj.rootNode
}