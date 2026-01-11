import { IEditor, IPublicModelPluginContext } from '@cc/lowcode-types';
import DesignerPlugin from './default-panel-registry.vue';

// 注册默认的面板
export const defaultPanelRegistry = (editor: IEditor) => {
  const fun = (ctx: IPublicModelPluginContext) => {
    return {
      init() {
        const { skeleton, config } = ctx;
        skeleton.add({
          area: 'mainArea',
          name: 'designer',
          type: 'Widget',
          content: <DesignerPlugin engineConfig={config} engineEditor={editor} />,
        });
      },
    };
  };

  fun.pluginName = '___default_panel___';

  return fun;
};
