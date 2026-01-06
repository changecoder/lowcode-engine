import { IPublicModelEditor } from '../../shell/model';
import { IEventBus } from './event';

export interface PluginConfig {
  pluginKey: string;
  type: string;
  props: {
    icon?: string;
    title?: string;
    width?: number;
    height?: number;
    visible?: boolean;
    disabled?: boolean;
    marked?: boolean;
    align?: 'left' | 'right' | 'top' | 'bottom';
    onClick?: () => void;
    dialogProps?: Record<string, unknown>;
    balloonProps?: Record<string, unknown>;
    panelProps?: Record<string, unknown>;
    linkProps?: Record<string, unknown>;
  };
  pluginProps?: Record<string, unknown>;
}

export interface PluginsConfig {
  [key: string]: PluginConfig[];
}

export interface EditorConfig {
  plugins?: PluginsConfig;
}

export interface IEditor extends IPublicModelEditor {
  config?: EditorConfig;
  eventBus: IEventBus;
}
