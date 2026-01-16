import { computed, ref } from 'vue';
import { Asset, AssetLevel, AssetList, AssetType, IPublicTypePackage } from '@cc/lowcode-types';
import { assetBundle, assetItem, getPublicPath, UtilsMetadata } from '@cc/lowcode-utils';
import { ISimulatorHost } from '../simulator';
import { IProject, Project } from '../project';
import { Designer, IDesigner } from '../designer';
import Viewport from './viewport';
import { createSimulator } from './create-simulator';
import { BuiltinSimulatorRenderer } from './renderer';

export type LibraryItem = IPublicTypePackage & {
  package: string;
  library: string;
  urls?: Asset;
  editUrls?: Asset;
};

export interface BuiltinSimulatorProps {
  designMode?: 'live' | 'design' | 'preview' | 'extend' | 'border';
  device?: 'mobile' | 'iphone' | string;
  deviceClassName?: string;
  environment?: Asset;
  requestHandlersMap?: any;
  extraEnvironment?: Asset;
  library?: LibraryItem[];
  utilsMetadata?: UtilsMetadata;
  simulatorUrl?: Asset;
  theme?: Asset;
  componentsAsset?: Asset;
  [key: string]: any;
}

const defaultEnvironment = [
  assetItem(
    AssetType.JSText,
    'window.Vue=parent.Vue;window.__is_simulator_env__=true;',
    undefined,
    'vue'
  ),
];

const defaultSimulatorUrl = (() => {
  const publicPath = getPublicPath();
  let urls;
  const [_, prefix = '', dev] = /^(.+?)(\/js)?\/?$/.exec(publicPath) || [];
  if (dev) {
    urls = [`${prefix}/css/simulator-renderer.css`, `${prefix}/js/simulator-renderer.js`];
  } else if (process.env.NODE_ENV === 'production') {
    urls = [`${prefix}/simulator-renderer.css`, `${prefix}/simulator-renderer.js`];
  } else {
    urls = [`${prefix}/simulator-renderer.css`, `${prefix}/simulator-renderer.js`];
  }
  return urls;
})();

export class BuiltinSimulatorHost implements ISimulatorHost<BuiltinSimulatorProps> {
  readonly isSimulator = true;
  readonly project: IProject;
  readonly designer: IDesigner;
  readonly viewport = new Viewport();
  readonly libraryMap: { [key: string]: string } = {};

  private _props = ref<BuiltinSimulatorProps>({});
  private _iframe?: HTMLIFrameElement;
  private _contentWindow = ref<Window>();
  private _contentDocument = ref<Document>();
  private _renderer?: BuiltinSimulatorRenderer;

  get renderer() {
    return this._renderer;
  }

  get theme(): Asset | undefined {
    return computed(() => this.get('theme')).value;
  }

  get contentWindow() {
    return this._contentWindow.value;
  }

  get contentDocument() {
    return this._contentDocument.value;
  }

  constructor(project: Project, designer: Designer) {
    this.project = project;
    this.designer = designer;
  }

  get(key: string): any {
    if (key === 'device') {
      return (
        this.designer?.editor?.get('deviceMapper')?.transform?.(this._props.value.device) ||
        this._props.value.device
      );
    }
    return this._props.value[key];
  }

  connect(renderer: any) {
    this._renderer = renderer;
  }

  mountViewport(viewport: HTMLElement | null) {
    this.viewport.mount(viewport);
  }

  async mountContentFrame(iframe: HTMLIFrameElement | null): Promise<void> {
    if (!iframe || this._iframe === iframe) {
      return;
    }
    this._iframe = iframe;
    this._contentWindow.value = iframe.contentWindow!;
    this._contentDocument.value = this._contentWindow.value.document;

    const libraryAsset: AssetList = this.buildLibrary();

    const vendors = [
      assetBundle(this.get('environment') || defaultEnvironment, AssetLevel.Environment),
      assetBundle(this.get('extraEnvironment'), AssetLevel.Environment),
      assetBundle(libraryAsset, AssetLevel.Library),
      assetBundle(this.theme, AssetLevel.Theme),
      // assetBundle(this.get('simulatorUrl') || defaultSimulatorUrl, AssetLevel.Runtime),
    ];

    // 准备 iframe 内容、依赖库注入
    const renderer = await createSimulator(this, iframe, vendors);

    renderer.run();
  }

  buildLibrary(library?: LibraryItem[]) {
    const _library = library || (this.get('library') as LibraryItem[]);
    const libraryAsset: AssetList = [];
    const libraryExportList: string[] = [];
    const functionCallLibraryExportList: string[] = [];

    if (_library && _library.length) {
      _library.forEach(item => {
        const { exportMode, exportSourceLibrary } = item;
        this.libraryMap[item.package] = item.library;
        if (item.exportName && item.library) {
          libraryExportList.push(
            `Object.defineProperty(window,'${item.exportName}',{get:()=>window.${item.library}});`
          );
        }
        if (exportMode === 'functionCall' && exportSourceLibrary) {
          functionCallLibraryExportList.push(
            `window["${item.library}"] = window["${exportSourceLibrary}"]("${item.library}", "${item.package}");`
          );
        }
        if (item.editUrls) {
          libraryAsset.push(item.editUrls);
        } else if (item.urls) {
          libraryAsset.push(item.urls);
        }
      });
    }
    libraryAsset.unshift(assetItem(AssetType.JSText, libraryExportList.join('')));
    libraryAsset.push(assetItem(AssetType.JSText, functionCallLibraryExportList.join('')));
    return libraryAsset;
  }

  setProps(props: BuiltinSimulatorProps) {
    this._props.value = props;
  }
}
