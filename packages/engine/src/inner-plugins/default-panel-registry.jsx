import DesignerPlugin from '@cc/lowcode-plugin-designer'

export const defaultPanelRegistry = (editor) => {
  const func = (ctx) => {
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

  func.pluginName = '___default_panel___'

  return func
}

export default defaultPanelRegistry