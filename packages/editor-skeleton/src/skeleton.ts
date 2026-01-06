import { IEditor, IPublicTypeSkeletonConfig, IPublicTypeWidgetBaseConfig } from '@cc/lowcode-types';
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

export interface ISkeleton {
  editor: IEditor;

  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly topArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;

  createContainer(
    name: string,
    handle: (item: any) => any,
    exclusive?: boolean,
    checkVisible?: () => boolean,
    defaultSetCurrent?: boolean
  ): WidgetContainer;

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): any;
}

export class Skeleton implements ISkeleton {
  private containers = new Map<string, WidgetContainer<any>>();
  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;
  readonly topArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>;

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

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>) {
    const { area } = config;
    switch (area) {
      case 'leftArea':
      case 'left':
        return this.leftArea.add(config as PanelDockConfig);
      case 'topArea':
      case 'top':
        return this.topArea.add(config as PanelDockConfig);
      default:
    }
  }
}
