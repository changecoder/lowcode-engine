import { IPublicTypeNodeData } from './node-data';
import { IPublicTypePropsMap } from './props-map';

export interface IPublicTypeNodeSchema {
  id?: string;
  componentName: string;
  props?: {
    children?: IPublicTypeNodeData | IPublicTypeNodeData[];
  } & IPublicTypePropsMap;
}
