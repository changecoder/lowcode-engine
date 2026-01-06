import { IPublicModelPluginContext } from '../model';
import { IPublicTypePluginConfig } from './plugin-config';

export type IPublicTypePluginCreater = (
  ctx: IPublicModelPluginContext,
  options: any
) => IPublicTypePluginConfig;
