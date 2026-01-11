import { createModuleEventBus } from '@cc/lowcode-editor-core';
import {
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
  IPluginContextOptions,
  IPluginPreferenceMananger,
  IPublicApiEvent,
  IPublicApiLogger,
  IPublicApiPlugins,
  IPublicApiSkeleton,
  IPublicModelEngineConfig,
  IPublicModelPluginContext,
  IPublicTypePluginDeclaration,
  IPublicTypePreferenceValueType,
} from '@cc/lowcode-types';

export function isValidPreferenceKey(
  key: string,
  preferenceDeclaration: IPublicTypePluginDeclaration
): boolean {
  if (!preferenceDeclaration || !Array.isArray(preferenceDeclaration.properties)) {
    return false;
  }
  return preferenceDeclaration.properties.some(prop => {
    return prop.key === key;
  });
}

export default class PluginContext
  implements IPublicModelPluginContext, ILowCodePluginContextPrivate
{
  preference!: IPluginPreferenceMananger;
  logger!: IPublicApiLogger;
  plugins!: IPublicApiPlugins;
  config!: IPublicModelEngineConfig;
  skeleton!: IPublicApiSkeleton;
  event!: IPublicApiEvent;
  pluginEvent: IPublicApiEvent;
  constructor(
    options: IPluginContextOptions,
    contextApiAssembler: ILowCodePluginContextApiAssembler
  ) {
    const { pluginName = 'anonymous', meta = {} } = options;
    this.pluginEvent = createModuleEventBus(pluginName, 200);
    contextApiAssembler.assembleApis(this, pluginName, meta);
  }

  setPreference(pluginName: string, preferenceDeclaration: IPublicTypePluginDeclaration): void {
    const getPreferenceValue = (
      key: string,
      defaultValue?: IPublicTypePreferenceValueType
    ): IPublicTypePreferenceValueType | undefined => {
      if (!isValidPreferenceKey(key, preferenceDeclaration)) {
        return undefined;
      }
      const pluginPreference = this.plugins.getPluginPreference(pluginName) || {};
      if (pluginPreference[key] === undefined || pluginPreference[key] === null) {
        return defaultValue;
      }
      return pluginPreference[key];
    };

    this.preference = {
      getPreferenceValue,
    };
  }
}
