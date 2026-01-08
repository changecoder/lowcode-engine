import {
  IEditor,
  IPublicApiSkeleton,
  IPublicTypePanelConfig,
  IPublicTypeSkeletonConfig,
  IPublicTypeWidgetBaseConfig,
  IPublicTypeConfigTransducer,
} from '@cc/lowcode-types';
import { isPlainObject, Logger } from '@cc/lowcode-utils';
import { DialogDockConfig, DockConfig, PanelDockConfig, WidgetConfig } from './types';
import {
  Dock,
  isDockConfig,
  isPanelDockConfig,
  isWidget,
  IWidget,
  PanelDock,
  Widget,
  WidgetContainer,
} from './widget';
import { Area } from './area';
import { isPanel, Panel } from './widget/panel';
import { isVNode } from 'vue';
import { engineConfig } from '@cc/lowcode-editor-core';

const logger = new Logger({ level: 'warn', bizName: 'skeleton' });

export interface ISkeleton
  extends Omit<
    IPublicApiSkeleton,
    | 'showPanel'
    | 'hidePanel'
    | 'showWidget'
    | 'enableWidget'
    | 'hideWidget'
    | 'disableWidget'
    | 'showArea'
    | 'onShowPanel'
    | 'onHidePanel'
    | 'onShowWidget'
    | 'onHideWidget'
    | 'remove'
    | 'hideArea'
    | 'add'
  > {
  editor: IEditor;

  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly topArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly leftFixedArea: Area<IPublicTypePanelConfig, Panel>;
  readonly leftFloatArea: Area<IPublicTypePanelConfig, Panel>;

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive?: boolean,
    checkVisible?: () => boolean,
    defaultSetCurrent?: boolean
  ): WidgetContainer;

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): any;

  createPanel(config: IPublicTypePanelConfig): Panel;

  getPanel(name: string): Panel | undefined;

  toggleFloatStatus(panel: Panel): void;
}

export class Skeleton implements ISkeleton {
  private panels = new Map<string, Panel>();
  private containers = new Map<string, WidgetContainer<any>>();
  private configTransducers: IPublicTypeConfigTransducer[] = [];
  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly topArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly leftFixedArea: Area<IPublicTypePanelConfig, Panel>;
  readonly leftFloatArea: Area<IPublicTypePanelConfig, Panel>;

  constructor(readonly editor: IEditor) {
    this.leftArea = new Area(
      this,
      'leftArea',
      config => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      false
    );
    this.topArea = new Area(
      this,
      'topArea',
      config => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      },
      false
    );
    this.leftFixedArea = new Area(
      this,
      'leftFixedArea',
      config => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true
    );
    this.leftFloatArea = new Area(
      this,
      'leftFloatArea',
      config => {
        if (isPanel(config)) {
          return config;
        }
        return this.createPanel(config);
      },
      true
    );
  }

  createWidget(config: IPublicTypeWidgetBaseConfig | IWidget) {
    if (isWidget(config)) {
      return config;
    }
    let widget: IWidget;
    if (isDockConfig(config)) {
      if (isPanelDockConfig(config)) {
        widget = new PanelDock(this, config);
      } else {
        widget = new Dock(this, config as DockConfig);
      }
    } else {
      widget = new Widget(this, config as WidgetConfig);
    }

    return widget;
  }

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive = false,
    checkVisible: () => boolean = () => true,
    defaultSetCurrent = false
  ) {
    const container = new WidgetContainer(name, handle, exclusive, checkVisible, defaultSetCurrent);
    this.containers.set(name, container);
    return container;
  }

  private parseConfig(config: IPublicTypeWidgetBaseConfig) {
    if (config.parsed) {
      return config;
    }
    const { content, ...restConfig } = config;
    if (content) {
      if (isPlainObject(content) && !isVNode(content)) {
        Object.keys(content).forEach(key => {
          if (/props$/i.test(key) && restConfig[key]) {
            restConfig[key] = {
              ...restConfig[key],
              ...(content as IPublicTypePanelConfig)[key],
            };
          } else {
            restConfig[key] = (content as IPublicTypePanelConfig)[key];
          }
        });
      } else {
        restConfig.content = content;
      }
    }
    restConfig.pluginKey = restConfig.name;
    restConfig.parsed = true;
    return restConfig;
  }

  registerConfigTransducer(transducer: IPublicTypeConfigTransducer, level = 100, id?: string) {
    transducer.level = level;
    transducer.id = id;
    const i = this.configTransducers.findIndex(item => item.level != null && item.level > level);
    if (i < 0) {
      this.configTransducers.push(transducer);
    } else {
      this.configTransducers.splice(i, 0, transducer);
    }
  }

  getRegisteredConfigTransducers(): IPublicTypeConfigTransducer[] {
    return this.configTransducers;
  }

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>) {
    const registeredTransducers = this.getRegisteredConfigTransducers();

    const parsedConfig = registeredTransducers.reduce(
      (prevConfig, current) => {
        return current(prevConfig);
      },
      {
        ...this.parseConfig(config),
        ...extraConfig,
      }
    );

    let { area } = parsedConfig;
    switch (area) {
      case 'leftArea':
      case 'left':
        return this.leftArea.add(parsedConfig as PanelDockConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig as PanelDockConfig);
      case 'leftFixedArea':
        return this.leftFixedArea.add(parsedConfig as IPublicTypePanelConfig);
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig as IPublicTypePanelConfig);
      default:
    }
  }

  getPanel(name: string): Panel | undefined {
    return this.panels.get(name);
  }

  createPanel(config: IPublicTypePanelConfig) {
    const parsedConfig = this.parseConfig(config);
    const panel = new Panel(this, parsedConfig as IPublicTypePanelConfig);
    this.panels.set(panel.name, panel);
    logger.debug(
      `Panel created with name: ${panel.name} \nconfig:`,
      config,
      '\n current panels: ',
      this.panels
    );
    return panel;
  }

  toggleFloatStatus(panel: Panel) {
    const isFloat = panel?.parent?.name === 'leftFloatArea';
    if (isFloat) {
      this.leftFloatArea.remove(panel);
      this.leftFixedArea.add(panel);
      this.leftFixedArea.container.active(panel);
    } else {
      this.leftFixedArea.remove(panel);
      this.leftFloatArea.add(panel);
      this.leftFloatArea.container.active(panel);
    }
    engineConfig.getPreference().set(`${panel.name}-pinned-status-isFloat`, !isFloat, 'skeleton');
  }
}
