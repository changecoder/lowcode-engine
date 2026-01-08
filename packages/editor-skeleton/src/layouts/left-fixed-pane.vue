<template>
  <div 
    :class="['lc-left-fixed-pane', { 'lc-area-visible': area.visible }]"
    :style="style"
  >
  <template 
    v-for="panel in area.container.items"
  >
    <component :is="panel.content" />
  </template>
  </div>
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Area } from '../area';
import { Panel } from '../widget';
import { IPublicTypePanelConfig } from '@cc/lowcode-types';
const { area } = defineProps<{
  area: Area<IPublicTypePanelConfig, Panel>
}>()
const style = computed(() => {
  const width = area.current?.config.props?.width
  return width ? {
    width,
  } : {};
})
</script>