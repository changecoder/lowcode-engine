import { Editor } from '@cc/lowcode-editor-core';
import { Asset } from '@cc/lowcode-types';

export interface PluginProps {
  engineEditor: Editor;
}

export interface DesignerPluginState {
  componentMetadatas?: any[] | null;
  library?: any[] | null;
  extraEnvironment?: any[] | null;
  renderEnv?: string;
  device?: string;
  locale?: string;
  designMode?: string;
  deviceClassName?: string;
  simulatorUrl: Asset | null;
  // @TODO 类型定义
  requestHandlersMap: any;
}
