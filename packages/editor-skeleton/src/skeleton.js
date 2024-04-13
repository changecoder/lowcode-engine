import { Area, isWidget, Widget, WidgetContainer } from '.'

export class Skeleton {
  containers = new Map()
  widgets = []

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
  }

  createWidget(config) {
    if (isWidget(config)) {
      return config
    }
    const widget = new Widget(this, config)
    this.widgets.push(widget)
    return widget
  }

  createContainer(name, handle) {
    const container = new WidgetContainer(name, handle)
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
      default:
    }
  }
}