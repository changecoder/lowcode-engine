import { VNode, Component } from 'vue';
import {
  IPublicTypePanelConfig,
  IPublicTypePanelConfigProps,
  IPublicTypePanelDockProps,
  IPublicTypeTitleContent,
  IPublicTypeWidgetBaseConfig,
  IPublicTypeWidgetConfigArea,
} from '@cc/lowcode-types';
import { IWidget } from './widget';

export interface DockProps extends IPublicTypePanelDockProps {}

export interface IDockBaseConfig extends IPublicTypeWidgetBaseConfig {
  props?: DockProps & {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
  };
}

export interface DockConfig extends IDockBaseConfig {
  type: 'Dock';
  content?: string | VNode | Component;
}

export interface PanelDockConfig extends IDockBaseConfig {
  type: 'PanelDock';
  panelName?: string;
  panelProps?: IPublicTypePanelConfigProps & {
    area?: IPublicTypeWidgetConfigArea;
  };
  content?: string | VNode | Component | IPublicTypePanelConfig[]; // content for pane
}

// 按钮弹窗扩展
export interface DialogDockConfig extends IDockBaseConfig {
  type: 'DialogDock';
  dialogProps?: {
    [key: string]: any;
    title?: IPublicTypeTitleContent;
  };
}

export interface WidgetConfig extends IPublicTypeWidgetBaseConfig {
  type: 'Widget';
  props?: {
    align?: 'left' | 'right' | 'bottom' | 'center' | 'top';
    onInit?: (widget: IWidget) => void;
    title?: IPublicTypeTitleContent | null;
  };
  content?: string | VNode | Component; // children
}

export interface TopAreaDataTopAreaData {
  left: Array<VNode>;
  center: Array<VNode>;
  right: Array<VNode>;
}

export interface LeftAreaData {
  bottom: Array<VNode>;
  top: Array<VNode>;
}
