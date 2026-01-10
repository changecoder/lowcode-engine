import { IPublicModelPluginContext } from '@cc/lowcode-types';
import IconOutline from './icons/outline.vue';
import { defineComponent, h } from 'vue';

export const MasterPaneName = 'outline-master-pane';

const OutlinePaneContext = defineComponent({
  render() {
    return h('div', {}, '大纲树');
  },
});

export const OutlinePlugin = (ctx: IPublicModelPluginContext, options: any) => {
  const { skeleton } = ctx;
  return {
    async init() {
      skeleton.add({
        area: 'leftArea',
        name: 'outlinePane',
        type: 'PanelDock',
        index: -1,
        content: {
          name: MasterPaneName,
          props: {
            icon: IconOutline,
            description: '大纲树',
          },
          content: OutlinePaneContext,
        },
        panelProps: {
          area: 'leftFloatArea',
          keepVisibleWhileDragging: true,
        },
        contentProps: {
          treeTitleExtra: false,
          paneName: MasterPaneName,
        },
      });
    },
  };
};

OutlinePlugin.meta = {
  eventPrefix: 'OutlinePlugin',
  preferenceDeclaration: {
    title: '大纲树插件配置',
    properties: [
      {
        key: 'extraTitle',
        type: 'object',
        description: '副标题',
      },
    ],
  },
};
OutlinePlugin.pluginName = 'OutlinePlugin';
