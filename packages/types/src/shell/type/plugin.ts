import { IPublicTypePluginCreater, IPublicTypePluginMeta } from '.';

export interface IPublicTypePlugin extends IPublicTypePluginCreater {
  pluginName: string;
  meta?: IPublicTypePluginMeta;
}
