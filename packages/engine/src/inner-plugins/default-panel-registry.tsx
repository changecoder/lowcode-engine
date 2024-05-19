import DesignerPlugin from './components/designer-plugin'

// 注册默认的面板
export const defaultPanelRegistry = (editor: any) => {
  const fun = (ctx: any) => {
    return {
      init() {
        const { skeleton, config } = ctx
        skeleton.add({
          area: 'mainArea',
          name: 'designer',
          type: 'Widget',
          content: <DesignerPlugin
            engineConfig={config}
            engineEditor={editor}
          />
        })
      }
    }
  }

  fun.pluginName = '___default_panel___'

  return fun
}