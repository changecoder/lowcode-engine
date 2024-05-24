import { IPublicTypePanelConfig, IPublicTypeSkeletonConfig, IPublicTypeWidgetBaseConfig } from '@cc/lowcode-types'
import { IEditor } from '@cc/lowcode-editor-core'
import { Area } from './area'
import { Dock, IWidget, Panel, PanelDock, Widget, isPanel, isWidget } from './widget'
import {
  DockConfig,
  WidgetConfig,
  PanelDockConfig,
  DialogDockConfig,
  isDockConfig,
  isPanelDockConfig,
  DividerConfig
} from './types'
import { WidgetContainer } from './widget'

export interface ISkeleton {
  editor: IEditor
  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>
  readonly topArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>
  readonly leftFloatArea: Area<IPublicTypePanelConfig, Panel>
  readonly mainArea: Area<WidgetConfig | IPublicTypePanelConfig, Widget | Panel>

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): any

  createContainer(name: string, andle: (item: any) => any): WidgetContainer
  createPanel(config: IPublicTypePanelConfig): Panel
}

export class Skeleton implements ISkeleton {
  private panels = new Map<string, Panel>()
  private containers = new Map<string, WidgetContainer<any>>()
  readonly leftArea: Area<DockConfig | PanelDockConfig | DialogDockConfig>
  readonly topArea: Area<DockConfig | DividerConfig | PanelDockConfig | DialogDockConfig>
  readonly leftFloatArea: Area<IPublicTypePanelConfig, Panel>
  readonly mainArea: Area<WidgetConfig | IPublicTypePanelConfig, Widget | Panel>
  readonly widgets: IWidget[] = []

  constructor(readonly editor: any) {
    this.editor = editor
    this.leftArea = new Area(
      this,
      'leftArea',
      (config) => {
        if (isWidget(config)) {
          return config;
        }
        return this.createWidget(config);
      }
    )
    this.topArea = new Area(
      this,
      'topArea',
      (config) => {
        if (isWidget(config)) {
          return config
        }
        return this.createWidget(config)
      }
    )
    this.leftFloatArea = new Area(
      this,
      'leftFloatArea',
      config => {
        if (isPanel(config)) {
          return config
        }
        return this.createPanel(config)
      }
    )
    this.mainArea = new Area(
      this,
      'mainArea',
      (config) => {
        if (isWidget(config)) {
          return config as Widget
        }
        return this.createWidget(config) as Widget
      }
    )
  }

  add(config: IPublicTypeSkeletonConfig, extraConfig?: Record<string, any>): any {
    const parsedConfig = { ...config, extraConfig }
    let { area } = parsedConfig
    if (!area) {
      if (parsedConfig.type === 'Panel') {
        area = 'leftFloatArea'
      } else if (parsedConfig.type === 'Widget') {
        area = 'mainArea'
      } else {
        area = 'leftArea'
      }
    }
    switch(area) {
      case 'leftArea':
      case 'left':
        return this.leftArea.add(parsedConfig as PanelDockConfig)
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig as PanelDockConfig)
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig as IPublicTypePanelConfig)
      case 'mainArea':
      case 'main':
      case 'center':
      case 'centerArea':
        return this.mainArea.add(parsedConfig as IPublicTypePanelConfig)
      default:
    }
  }

  createWidget(config: IPublicTypeWidgetBaseConfig | IWidget) {
    if (isWidget(config)) {
      return config
    }
    let widget: IWidget
    if (isDockConfig(config)) {
      if (isPanelDockConfig(config)) {
        widget = new PanelDock(this, config)
      } else {
        widget = new Dock(this, config)
      }
    } else {
      widget = new Widget(this, config  as WidgetConfig)
    }

    this.widgets.push(widget)
    return widget
  }
  
  createPanel(config: IPublicTypePanelConfig): any {
    const parsedConfig = { ...config}
    const panel = new Panel(this, parsedConfig)
    this.panels.set(panel.name, panel)
    return panel
  }

  createContainer(name: string, handle: (item: any) => any) {
    const container = new WidgetContainer(name, handle)
    this.containers.set(name, container)
    return container
  }
}