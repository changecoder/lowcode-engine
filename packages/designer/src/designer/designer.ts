import { IPublicModelEditor, IPublicTypeComponentMetadata } from '@cc/lowcode-types';

export interface DesignerProps {
  [key: string]: any;
  editor: IPublicModelEditor;
  className?: string;
  style?: object;
  viewName?: string;
  simulatorProps?: Record<string, any>;
  componentMetadatas?: IPublicTypeComponentMetadata[];
}

export class Designer {
  viewName: string | undefined;
}
