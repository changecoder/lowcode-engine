import { createApp, ref, VNode, VueElement } from 'vue';
import { BuiltinSimulatorRenderer } from '@cc/lowcode-designer';
import { Asset } from '@cc/lowcode-types';
import { AssetLoader } from '@cc/lowcode-utils';

import { host } from './host';
import SimulatorRendererView from './renderer-view.vue';

const loader = new AssetLoader();

export class DocumentInstance {
  instancesMap = new Map<string, VNode[]>();
}

export class SimulatorRendererContainer implements BuiltinSimulatorRenderer {
  readonly isSimulatorRenderer = true;
  readonly libraryMap: { [key: string]: string } = {};

  private disposeFunctions: Array<() => void> = [];
  private _documentInstances = ref<Array<DocumentInstance>>([]);
  private _componentsMap = ref({});
  private _running = false;
  private _libraryMap: { [key: string]: string } = {};
  private _components: Record<string, VueElement> | null = {};

  get documentInstances() {
    return this._documentInstances;
  }

  get components(): Record<string, VueElement> {
    return this._components || {};
  }

  get componentsMap(): any {
    return this._componentsMap;
  }

  constructor() {
    console.log('vue simulator renderer');
  }

  private buildComponents() {
    this._components = {};
    this._components = {};
  }

  /**
   * 加载资源
   */
  load(asset: Asset): Promise<any> {
    return loader.load(asset);
  }

  run() {
    if (this._running) {
      return;
    }
    this._running = true;
    const containerId = 'app';
    let container = document.getElementById(containerId);
    if (!container) {
      container = document.createElement('div');
      document.body.appendChild(container);
      container.id = containerId;
    }

    document.documentElement.classList.add('engine-page');
    document.body.classList.add('engine-document');

    createApp(SimulatorRendererView, { rendererContainer: this }).mount(container);
    host.project.setRendererReady(this);
  }
}

export default new SimulatorRendererContainer();
