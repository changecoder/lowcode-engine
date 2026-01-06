import { Component } from 'vue';
import { RequestHandlersMap } from './data-source-type';

export interface IPublicTypeEngineOptions {
  /**
   * 是否开启 condition 的能力，默认在设计器中不管 condition 是啥都正常展示
   * @default false
   */
  enableCondition?: boolean;
  /**
   * 设备类型，默认值：'default'
   * @default 'default'
   */
  device?: 'default' | 'mobile' | string;
  /**
   * 指定初始化的 deviceClassName，挂载到画布的顶层节点上
   */
  deviceClassName?: string;
  /**
   * 语言，默认值：'zh-CN'
   * @default 'zh-CN'
   */
  locale?: string;
  /**
   * 设备类型映射器，处理设计器与渲染器中 device 的映射
   */
  deviceMapper?: {
    transform: (originalDevice: string) => string;
  };
  /**
   * 是否开启严格插件模式，严格模式下，插件将无法通过 engineOptions 传递自定义配置项
   * @default true
   */
  enableStrictPluginMode?: boolean;
  /**
   * 开启拖拽组件时，即将被放入的容器是否有视觉反馈
   * @default false
   */
  enableReactiveContainer?: boolean;
  /**
   * 关闭画布自动渲染，在资产包多重异步加载的场景有效
   * @default false
   */
  disableAutoRender?: boolean;
  /**
   * 关闭拖拽组件时的虚线响应，性能考虑
   * @default false
   */
  disableDetecting?: boolean;
  /**
   * 定制画布中点击被忽略的 selectors
   * @default undefined
   */
  customizeIgnoreSelectors?: (defaultIgnoreSelectors: string[], e: MouseEvent) => string[];
  /**
   * 禁止默认的设置面板
   * @default false
   */
  disableDefaultSettingPanel?: boolean;
  /**
   * 禁止默认的设置器
   * @default false
   */
  disableDefaultSetters?: boolean;
  /**
   * 打开画布的锁定操作
   * @default false
   */
  enableCanvasLock?: boolean;
  /**
   * 容器锁定后，容器本身是否可以设置属性，仅当画布锁定特性开启时生效
   * @default false
   */
  enableLockedNodeSetting?: boolean;
  /**
   * 当选中节点切换时，是否停留在相同的设置 tab 上
   * @default false
   */
  stayOnTheSameSettingTab?: boolean;
  /**
   * 是否在只有一个 item 的时候隐藏设置 tabs
   * @default false
   */
  hideSettingsTabsWhenOnlyOneItem?: boolean;
  /**
   * 自定义 loading 组件
   */
  loadingComponent?: Component;
  /**
   * 设置所有属性支持变量配置
   * @default false
   */
  supportVariableGlobally?: boolean;
  /**
   * 设置 simulator 相关的 url
   * @default undefined
   */
  simulatorUrl?: string[];
  /**
   * 渲染模块的全局上下文
   */
  appHelper?: {
    /** 全局公共函数 */
    utils?: Record<string, any>;
    /** 全局常量 */
    constants?: Record<string, any>;
  };
  /**
   * 数据源引擎的请求处理器映射
   */
  requestHandlersMap?: RequestHandlersMap;
  /**
   * JSExpression 是否只支持使用 this 来访问上下文变量，假如需要兼容原来的 'state.xxx'，则设置为 false
   * @default true
   */
  thisRequiredInJSE?: boolean;
  /**
   * 当开启组件未找到严格模式时，渲染模块不会默认给一个容器组件
   * @default false
   */
  enableStrictNotFoundMode?: boolean;
  /**
   * 配置指定节点为根组件
   */
  focusNodeSelector?: (rootNode: Node) => Node;
  /**
   * 开启应用级设计模式
   */
  enableWorkspaceMode?: boolean;
  /**
   * 应用级设计模式下，自动打开第一个窗口
   * @default true
   */
  enableAutoOpenFirstWindow?: boolean;
  /**
   * 开启右键菜单能力
   * @default false
   */
  enableContextMenu?: boolean;
  /**
   * 隐藏设计器辅助层
   * @default false
   */
  hideComponentAction?: boolean;
}
