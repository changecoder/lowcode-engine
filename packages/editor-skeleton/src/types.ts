import { 
  IPublicTypeWidgetBaseConfig,
  IPublicTypePanelDockProps,
  IPublicTypePanelConfigProps,
  IPublicTypeWidgetConfigArea 
} from '@cc/lowcode-types'
import { IWidget } from './widget'

export interface DockProps extends IPublicTypePanelDockProps {
}

export interface DividerConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Divider'
  props?: {
    align?: 'left' | 'right' | 'center'
  }
}

export interface IDockBaseConfig extends IPublicTypeWidgetBaseConfig {
  props?: DockProps & {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
  };
}

export interface DockConfig extends IDockBaseConfig {
  type: 'Dock';
  content?: any
}

export interface PanelDockConfig extends IDockBaseConfig {
  type: 'PanelDock'
  panelName?: string
  panelProps?: IPublicTypePanelConfigProps & {
    area?: IPublicTypeWidgetConfigArea
  }
  content?: any; // content for pane
}

export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Widget'
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top'
    onInit?: (widget: IWidget) => void
    title?: any
  }
  content?: any // children
}

// 按钮弹窗扩展
export interface DialogDockConfig extends IDockBaseConfig {
  type: 'DialogDock'
  dialogProps?: {
    [key: string]: any
    title?: any
  }
}

export function isDockConfig(obj: any): obj is DockConfig {
  return obj && /Dock$/.test(obj.type)
}

export function isPanelDockConfig(obj: any): obj is PanelDockConfig {
  return obj && obj.type === 'PanelDock'
}