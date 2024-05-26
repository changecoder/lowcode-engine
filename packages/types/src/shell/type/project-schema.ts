import { IPublicTypeRootSchema } from '.'

/**
 * 应用描述
 */
export interface IPublicTypeProjectSchema<T = IPublicTypeRootSchema> {
  id?: string
  /**
   * 当前应用协议版本号
   */
  version: string
  /**
   * 描述应用所有页面、低代码组件的组件树
   * 低代码业务组件树描述
   * 是长度固定为 1 的数组，即数组内仅包含根容器的描述（低代码业务组件容器类型）
   */
  componentsTree: T[],
  componentsMap: any,
  /**
   * 当前应用配置信息
   */
  config?: any
}