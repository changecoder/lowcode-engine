import { createApp } from 'vue';
import {
  IEditor,
  ILowCodePluginContextApiAssembler,
  ILowCodePluginContextPrivate,
  IPublicApiPlugins,
  IPublicTypeDisposable,
  IPublicTypeEngineOptions,
  IPublicTypePluginMeta,
  PluginPreference,
} from '@cc/lowcode-types';
import { isPlainObject, Logger } from '@cc/lowcode-utils';
import { commonEvent, Editor, engineConfig, globalContext } from '@cc/lowcode-editor-core';
import { Plugins, Common, Event, Skeleton, Config } from '@cc/lowcode-shell';
import { LowCodePluginManager, Designer } from '@cc/lowcode-designer';
import { Skeleton as InnerSkeleton } from '@cc/lowcode-editor-skeleton';
import { OutlinePlugin } from '@cc/lowcode-plugin-outline-pane';

import { defaultPanelRegistry } from './inner-plugins/default-panel-registry';

import { shellModelFactory } from './modules/shell-model-factory';

async function registryInnerPlugin(
  editor: IEditor,
  plugins: IPublicApiPlugins
): Promise<IPublicTypeDisposable> {
  const defaultPanelRegistryPlugin = defaultPanelRegistry(editor);
  await plugins.register(OutlinePlugin, {}, { autoInit: true });
  await plugins.register(defaultPanelRegistryPlugin);

  return () => {
    plugins.delete(OutlinePlugin.pluginName);
    plugins.delete(defaultPanelRegistryPlugin.pluginName);
  };
}

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
    context.config = config;
    editor.set('pluginContext', context);
  },
};

const editor = new Editor();
globalContext.register(editor, Editor);
globalContext.register(editor, 'editor');

const designer = new Designer({ editor, shellModelFactory });
editor.set('designer', designer);
const innerSkeleton = new InnerSkeleton(editor);
editor.set('skeleton', innerSkeleton);
const innerPlugins = new LowCodePluginManager(pluginContextApiAssembler);
const plugins = new Plugins(innerPlugins).toProxy();
editor.set('innerPlugins', innerPlugins);
editor.set('plugins', plugins);

const event = new Event(commonEvent, { prefix: 'common' });
const logger = new Logger({ level: 'warn', bizName: 'common' });
const common = new Common(editor, innerSkeleton);
const config = new Config(engineConfig);

export { config, common, event, logger, plugins };

export const isOpenSource = true;
engineConfig.set('isOpenSource', isOpenSource);
export const version = VERSION_PLACEHOLDER;
engineConfig.set('ENGINE_VERSION', version);

let engineContainer: HTMLElement;

registryInnerPlugin(editor, plugins);

export const init = async (
  container: HTMLElement,
  options?: IPublicTypeEngineOptions,
  pluginPreference?: PluginPreference
) => {
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
