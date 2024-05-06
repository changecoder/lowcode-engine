<template>
  <div class="lowcode-plugin-designer">
    <DesignerView
      className="lowcode-plugin-designer"
      :designer="engineEditor.get('designer')"
      :editor="engineEditor"
    />
  </div>
</template>
<script setup>
import { reactive } from 'vue'
import { DesignerView } from '@cc/lowcode-designer'
import { engineConfig } from '@cc/lowcode-editor-core'
const props = defineProps(['engineEditor'])
const state = reactive({
  componentMetadatas: [],
  library: [],
  utilsMetadata: [],
  simulatorUrl: null
})

const setupAssets = async () => {
  const editor = props.engineEditor
  try {
    const assets = await editor.onceGot('assets')
    const simulatorUrl = engineConfig.get('simulatorUrl') || editor.get('simulatorUrl')
    const { components, packages, utils } = assets
    if (components) {
      state.componentMetadatas = []
    }
    if (packages) {
      state.library = packages
    }
    if (utils) {
      state.utilsMetadata = utils
    }
    state.simulatorUrl = simulatorUrl
  } catch (e) {
    console.log(e)
  }

}

setupAssets()
</script>
<style>
.lowcode-plugin-designer {
  width: 100%;
  height: 100%;
}
</style>