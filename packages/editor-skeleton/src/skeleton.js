import { reactive } from 'vue'
import { Area, isWidget, Widget, PanelDock, Panel, isPanel, WidgetContainer, isDockConfig, isPanelDockConfig } from '.'

export class Skeleton {
  containers = new Map()
  widgets = []
  panels = new Map()

  constructor(editor) {
    this.editor = editor
    this.topArea = new Area(
      this,
      'topArea',
      config => {
        if (isWidget(config)) {
          return config
        }
        return this.createWidget(config)
      },
      false
    )
    this.leftArea = new Area(
      this,
      'leftArea',
      config => {
        if (isWidget(config)) {
          return config
        }
        return this.createWidget(config)
      },
      false
    )
    this.leftFixedArea = new Area(
      this,
      'leftFixedArea',
      (config) => {
        if (isPanel(config)) {
          return config
        }
        return this.createPanel(config)
      },
      true
    )
    this.leftFloatArea = reactive(new Area(
      this,
      'leftFloatArea',
      config => {
        if (isPanel(config)) {
          return config
        }
        return this.createPanel(config)
      },
      true
    ))
    this.mainArea = new Area(
      this,
      'mainArea',
      config => {
        if (isPanel(config)) {
          return config
        }
        return this.createPanel(config)
      },
      true,
      true
    )
    this.setupPlugins()
  }

  createWidget(config) {
    if (isWidget(config)) {
      return config
    }
    let widget
    if (isDockConfig(config)) {
      if (isPanelDockConfig(config)) {
        widget = new PanelDock(this, config)
      }
    } else {
      widget = new Widget(this, config)
    }

    this.widgets.push(widget)
    return widget
  }

  createPanel(config) {
    const parsedConfig = { ...config }
    const panel = new Panel(this, parsedConfig)
    this.panels.set(panel.name, panel)
    console.debug(`Panel created with name: ${panel.name} \nconfig:`, config, '\n current panels: ', this.panels)
    return panel
  }

  createContainer(
    name,
    handle,
    exclusive = false,
    checkVisible = () => true
  ) {
    const container = new WidgetContainer(name, handle, exclusive, checkVisible)
    this.containers.set(name, container)
    return container
  }

  add(config, extraConfig = {}) {
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
        return this.leftArea.add(parsedConfig)
      case 'topArea':
      case 'top':
        return this.topArea.add(parsedConfig)
      case 'mainArea':
      case 'main':
      case 'center':
      case 'centerArea':
        return this.mainArea.add(parsedConfig)
      case 'leftFloatArea':
        return this.leftFloatArea.add(parsedConfig)
      default:
    }
  }

  buildFromConfig(config, components = {}) {
    if (config) {
      this.editor.init(config, components)
    }
    this.setupPlugins()
  }

  setupPlugins() {
    const { config, components = {} } = this.editor
    if (!config) {
      return
    }

    const { plugins } = config
    if (!plugins) {
      return
    }

    Object.keys(plugins).forEach((area) => {
      plugins[area].forEach((item) => {
        console.log(item)
      })
    })
  }
}