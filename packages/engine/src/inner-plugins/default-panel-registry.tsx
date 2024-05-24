import { Suspense, defineAsyncComponent } from 'vue'

const DesignerPlugin = defineAsyncComponent(() => import('./components/designer-plugin'))

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
          content: <Suspense>
            <DesignerPlugin
              engineConfig={config}
              engineEditor={editor}
            />
          </Suspense>
        })
      }
    }
  }

  fun.pluginName = '___default_panel___'

  return fun
}