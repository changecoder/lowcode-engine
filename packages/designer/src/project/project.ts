import { createModuleEventBus } from '@cc/lowcode-editor-core';
import {
  IEventBus,
  IPublicTypeProjectSchema,
  IPublicTypeSimulatorRenderer,
} from '@cc/lowcode-types';
import { ISimulatorHost } from '../simulator';
import { IDesigner } from '../designer';

export interface IProject {
  get designer(): IDesigner;

  get simulator(): ISimulatorHost | null;

  setRendererReady(renderer: IPublicTypeSimulatorRenderer): void;
}

export class Project implements IProject {
  private emitter: IEventBus = createModuleEventBus('Project');
  private data: IPublicTypeProjectSchema = {
    version: '1.0.0',
    componentsMap: [],
    componentsTree: [],
    i18n: {},
  };
  private _simulator?: ISimulatorHost;
  private isRendererReady: boolean = false;

  get simulator(): ISimulatorHost | null {
    return this._simulator || null;
  }

  constructor(
    readonly designer: IDesigner,
    schema?: IPublicTypeProjectSchema,
    readonly viewName = 'global'
  ) {
    this.designer = designer;
    this.load(schema);
  }

  /**
   * 整体设置项目 schema
   */
  load(schema?: IPublicTypeProjectSchema) {
    this.data = {
      version: '1.0.0',
      componentsMap: [],
      componentsTree: [],
      i18n: {},
      ...schema,
    };
  }

  setRendererReady(renderer: any) {
    this.isRendererReady = true;
    this.emitter.emit('lowcode_engine_renderer_ready', renderer);
  }
}
