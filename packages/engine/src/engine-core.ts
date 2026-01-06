import { createApp } from 'vue';
import {
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
  IPublicTypeEngineOptions,
  IPublicTypePluginMeta,
  PluginPreference,
} from '@cc/lowcode-types';
import { isPlainObject, Logger } from '@cc/lowcode-utils';
import { commonEvent, Editor, engineConfig } from '@cc/lowcode-editor-core';
import { Plugins, Common, Event, Skeleton } from '@cc/lowcode-shell';
import { LowCodePluginManager } from '@cc/lowcode-designer';
import { Skeleton as InnerSkeleton } from '@cc/lowcode-editor-skeleton';

const pluginContextApiAssembler: ILowCodePluginContextApiAssembler = {
  assembleApis: (
    context: ILowCodePluginContextPrivate,
    pluginName: string,
    meta: IPublicTypePluginMeta
  ) => {
    const eventPrefix = meta?.eventPrefix || 'common';
    context.logger = new Logger({ level: 'warn', bizName: `plugin:${pluginName}` });
    context.plugins = plugins;
    context.event = new Event(commonEvent, { prefix: eventPrefix });
    context.skeleton = new Skeleton(innerSkeleton, pluginName, false);
  },
};

const editor = new Editor();
const innerSkeleton = new InnerSkeleton(editor);
const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);
const plugins = new Plugins(innerPlugins).toProxy();
const event = new Event(commonEvent, { prefix: 'common' });
const logger = new Logger({ level: 'warn', bizName: 'common' });
const common = new Common(editor, innerSkeleton);

export { plugins, event, logger, common };

export const isOpenSource = true;
engineConfig.set('isOpenSource', isOpenSource);
export const version = VERSION_PLACEHOLDER;
engineConfig.set('ENGINE_VERSION', version);
let engineContainer: HTMLElement;

export const init = async (
  container: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: PluginPreference
) => {
  await destroy();

  let engineOptions = null;
  if (isPlainObject(container)) {
    engineOptions = container;
    engineContainer = document.createElement('div');
    engineContainer.id = 'engine';
    document.body.appendChild(engineContainer);
  } else {
    engineOptions = options;
    engineContainer = container;
    if (!container) {
      engineContainer = document.createElement('div');
      engineContainer.id = 'engine';
      document.body.appendChild(engineContainer);
    }
  }
  engineConfig.setEngineOptions(engineOptions as any);

  await plugins.init(pluginPreference as any);

  const { Workbench } = common.skeletonCabin;

  createApp(Workbench, {
    skeleton: innerSkeleton,
    className: 'engine-main',
    topAreaItemClassName: 'engine-actionitem',
  }).mount(engineContainer);
};

export const destroy = async () => {};
