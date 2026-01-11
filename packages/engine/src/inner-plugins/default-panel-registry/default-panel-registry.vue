<template>
  <designer-view
    class-name="lowcode-plugin-designer"
    :editor="editor"
    :designer="editor.get('designer')"
    :name="editor.viewName"
    :component-metadatas="state.componentMetadatas"
    :simulator-props="{
      library: state.library,
      extraEnvironment: state.extraEnvironment,
      renderEnv: state.renderEnv,
      device: state.device,
      locale: state.locale,
      designMode: state.designMode,
      deviceClassName: state.deviceClassName,
      simulatorUrl: state.simulatorUrl,
      requestHandlersMap: state.requestHandlersMap,
    }"
  >
  </designer-view>
</template>
<script setup lang="ts">
import { reactive, onMounted } from 'vue';
import { DesignerView } from '@cc/lowcode-designer';
import { Editor, engineConfig } from '@cc/lowcode-editor-core';
const { engineEditor: editor } = defineProps<{
  engineEditor: Editor;
}>();
const state = reactive({
  componentMetadatas: null,
  library: null,
  extraEnvironment: null,
  utilsMetadata: null,
  renderEnv: engineConfig.get('renderEnv') || editor.get('renderEnv'),
  device: engineConfig.get('device') || editor.get('device'),
  locale: engineConfig.get('locale') || editor.get('locale'),
  designMode: engineConfig.get('designMode') || editor.get('designMode'),
  deviceClassName: engineConfig.get('deviceClassName') || editor.get('deviceClassName'),
  simulatorUrl: engineConfig.get('simulatorUrl') || editor.get('simulatorUrl'),
  requestHandlersMap: engineConfig.get('requestHandlersMap') || editor.get('requestHandlersMap'),
});
engineConfig.onGot('locale', locale => {
  state.locale = locale;
});
engineConfig.onGot('requestHandlersMap', requestHandlersMap => {
  state.requestHandlersMap = requestHandlersMap;
});
engineConfig.onGot('device', device => {
  state.device = device;
});
onMounted(async () => {
  const assets = await editor.onceGot('assets');
  const { components, packages, extraEnvironment, utils } = assets;
  state.extraEnvironment = extraEnvironment;
  state.componentMetadatas = components || [];
  state.library = packages;
  state.utilsMetadata = utils || [];
});
</script>
