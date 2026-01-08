import semverSatisfies from 'semver/functions/satisfies';
import {
  ILowCodePluginContextApiAssembler,
  ILowCodePluginManager,
  ILowCodePluginRuntime,
  IPluginContextOptions,
  IPublicTypePlugin,
  IPublicTypePluginDeclaration,
  IPublicTypePluginRegisterOptions,
  IPublicTypePreferenceValueType,
  PluginPreference,
  IPublicModelPluginContext,
} from '@cc/lowcode-types';
import { engineConfig } from '@cc/lowcode-editor-core';
import { getLogger, isPlainObject } from '@cc/lowcode-utils';
import LowCodePluginContext, { isValidPreferenceKey } from './plugin-context';
import { invariant } from '../invariant';
import { LowCodePluginRuntime } from './plugin';

const logger = getLogger({ level: 'warn', bizName: 'designer:pluginManager' });

// 保留的事件前缀
const RESERVED_EVENT_PREFIX = [
  'designer',
  'editor',
  'skeleton',
  'renderer',
  'render',
  'utils',
  'plugin',
  'engine',
  'editor-core',
  'engine-core',
  'plugins',
  'event',
  'events',
  'log',
  'logger',
  'ctx',
  'context',
];

export function isLowCodeRegisterOptions(opts: any): opts is IPublicTypePluginRegisterOptions {
  return opts && ('autoInit' in opts || 'override' in opts);
}

export function filterValidOptions(opts: any, preferenceDeclaration: IPublicTypePluginDeclaration) {
  if (!opts || !isPlainObject(opts)) return opts;
  const filteredOpts = {} as any;
  Object.keys(opts).forEach(key => {
    if (isValidPreferenceKey(key, preferenceDeclaration)) {
      const v = opts[key];
      if (v !== undefined && v !== null) {
        filteredOpts[key] = v;
      }
    }
  });
  return filteredOpts;
}

interface ITaks {
  [key: string]: {
    name: string;
    dep: string[];
  };
}

function sequence({
  tasks,
  names,
  results,
  missing,
  recursive,
  nest,
  parentName,
}: {
  tasks: ITaks;
  names: string[];
  results: string[];
  missing: string[];
  recursive: string[][];
  nest: string[];
  parentName?: string;
}) {
  names.forEach(name => {
    if (results.indexOf(name) !== -1) {
      return; // de-dup results
    }
    const node = tasks[name];
    if (!node) {
      missing.push([parentName, name].filter(d => !!d).join('.'));
    } else if (nest.indexOf(name) > -1) {
      nest.push(name);
      recursive.push(nest.slice(0));
      nest.pop();
    } else if (node.dep.length) {
      nest.push(name);
      sequence({
        tasks,
        parentName: name,
        names: node.dep,
        results,
        missing,
        recursive,
        nest,
      }); // recurse
      nest.pop();
    }
    results.push(name);
  });
}

function sequencify(tasks: ITaks, names: string[]) {
  let results: string[] = []; // the final sequence
  const missing: string[] = []; // missing tasks
  const recursive: string[][] = []; // recursive task dependencies

  sequence({
    tasks,
    names,
    results,
    missing,
    recursive,
    nest: [],
  });

  if (missing.length || recursive.length) {
    results = []; // results are incomplete at best, completely wrong at worst, remove them to avoid confusion
  }

  return {
    sequence: results,
    missingTasks: missing,
    recursiveDependencies: recursive,
  };
}

export class LowCodePluginManager implements ILowCodePluginManager {
  private plugins: ILowCodePluginRuntime[] = [];
  private pluginPreference?: PluginPreference = new Map();
  pluginsMap: Map<string, ILowCodePluginRuntime> = new Map();
  pluginContextMap: Map<string, LowCodePluginContext> = new Map();
  contextApiAssembler: ILowCodePluginContextApiAssembler;

  constructor(
    contextApiAssembler: ILowCodePluginContextApiAssembler,
    readonly viewName = 'global'
  ) {
    this.contextApiAssembler = contextApiAssembler;
  }

  async init(pluginPreference?: PluginPreference) {
    const pluginNames: string[] = [];
    const pluginObj: { [name: string]: ILowCodePluginRuntime } = {};
    this.pluginPreference = pluginPreference;
    this.plugins.forEach(plugin => {
      pluginNames.push(plugin.name);
      pluginObj[plugin.name] = plugin;
    });
    const { missingTasks, sequence } = sequencify(pluginObj, pluginNames);
    invariant(!missingTasks.length, 'plugin dependency missing', missingTasks);
    logger.log('load plugin sequence:', sequence);

    for (const pluginName of sequence) {
      try {
        await this.pluginsMap.get(pluginName)!.init();
      } catch (e) /* istanbul ignore next */ {
        logger.error(
          `Failed to init plugin:${pluginName}, it maybe affect those plugins which depend on this.`
        );
        logger.error(e);
      }
    }
  }

  async register(
    pluginModel: IPublicTypePlugin,
    options?: any,
    registerOptions?: IPublicTypePluginRegisterOptions
  ): Promise<void> {
    if (isLowCodeRegisterOptions(options)) {
      registerOptions = options;
      options = {};
    }
    let { pluginName, meta = {} } = pluginModel;
    const { preferenceDeclaration, engines } = meta;
    const { eventPrefix } = meta;
    const isReservedPrefix = RESERVED_EVENT_PREFIX.find(item => item === eventPrefix);
    if (isReservedPrefix) {
      meta.eventPrefix = undefined;
      logger.warn(
        `plugin ${pluginName} is trying to use ${eventPrefix} as event prefix, which is a reserved event prefix, please use another one`
      );
    }
    const ctx = this._getLowCodePluginContext({ pluginName, meta });
    const customFilterValidOptions = engineConfig.get(
      'customPluginFilterOptions',
      filterValidOptions
    );
    const pluginTransducer = engineConfig.get('customPluginTransducer', null);
    const newPluginModel = pluginTransducer
      ? await pluginTransducer(pluginModel, ctx, options)
      : pluginModel;
    const newOptions = customFilterValidOptions(
      options,
      newPluginModel.meta?.preferenceDeclaration
    );
    const config = newPluginModel(ctx, newOptions);
    pluginName = pluginName || config.name;
    invariant(pluginName, 'pluginConfigCreator.pluginName required', config);
    ctx.setPreference(pluginName, preferenceDeclaration!);
    const allowOverride = registerOptions?.override === true;

    if (this.pluginsMap.has(pluginName)) {
      if (!allowOverride) {
        throw new Error(`Plugin with name ${pluginName} exists`);
      } else {
        // clear existing plugin
        const originalPlugin = this.pluginsMap.get(pluginName);
        logger.log(
          'plugin override, originalPlugin with name ',
          pluginName,
          ' will be destroyed, config:',
          originalPlugin?.config
        );
        originalPlugin?.destroy();
        this.pluginsMap.delete(pluginName);
      }
    }

    const engineVersionExp = engines && engines.lowcodeEngine;
    if (engineVersionExp && !this.isEngineVersionMatched(engineVersionExp)) {
      throw new Error(
        `plugin ${pluginName} skipped, engine check failed, current engine version is ${engineConfig.get('ENGINE_VERSION')}, meta.engines.lowcodeEngine is ${engineVersionExp}`
      );
    }

    const plugin = new LowCodePluginRuntime(pluginName, this, config, meta);
    if (registerOptions?.autoInit) {
      await plugin.init();
    }
    this.plugins.push(plugin);
    this.pluginsMap.set(pluginName, plugin);
    logger.log(`plugin registered with pluginName: ${pluginName}, config: `, config, 'meta:', meta);
  }

  _getLowCodePluginContext = (options: IPluginContextOptions) => {
    const { pluginName } = options;
    let context = this.pluginContextMap.get(pluginName);
    if (!context) {
      context = new LowCodePluginContext(options, this.contextApiAssembler);
      this.pluginContextMap.set(pluginName, context);
    }
    return context;
  };

  isEngineVersionMatched(versionExp: string): boolean {
    const engineVersion = engineConfig.get('ENGINE_VERSION');
    return semverSatisfies(engineVersion, versionExp, { includePrerelease: true });
  }

  get(pluginName: string): ILowCodePluginRuntime | undefined {
    return this.pluginsMap.get(pluginName);
  }

  getAll(): ILowCodePluginRuntime[] {
    return this.plugins;
  }

  has(pluginName: string): boolean {
    return this.pluginsMap.has(pluginName);
  }

  async delete(pluginName: string): Promise<boolean> {
    const plugin = this.plugins.find(({ name }) => name === pluginName);
    if (!plugin) {
      return false;
    }
    await plugin.destroy();
    const idx = this.plugins.indexOf(plugin);
    this.plugins.splice(idx, 1);
    return this.pluginsMap.delete(pluginName);
  }

  async destroy() {
    for (const plugin of this.plugins) {
      await plugin.destroy();
    }
  }

  get size() {
    return this.pluginsMap.size;
  }

  getPluginPreference(
    pluginName: string
  ): Record<string, IPublicTypePreferenceValueType> | null | undefined {
    if (!this.pluginPreference) {
      return null;
    }
    return this.pluginPreference.get(pluginName);
  }

  toProxy() {
    return new Proxy(this, {
      get(target, prop, receiver) {
        if (target.pluginsMap.has(prop as string)) {
          // 禁用态的插件，直接返回 undefined
          if (target.pluginsMap.get(prop as string)!.disabled) {
            return undefined;
          }
          return target.pluginsMap.get(prop as string)?.toProxy();
        }
        return Reflect.get(target, prop, receiver);
      },
    });
  }

  /* istanbul ignore next */
  setDisabled(pluginName: string, flag = true) {
    logger.warn(`plugin:${pluginName} has been set disable:${flag}`);
    this.pluginsMap.get(pluginName)?.setDisabled(flag);
  }

  async dispose() {
    await this.destroy();
    this.plugins = [];
    this.pluginsMap.clear();
  }
}
