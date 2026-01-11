<template>
  <div :class="['lc-left-float-pane', { 'lc-area-visible': area.visible }]" :style="style">
    <component :is="panel.content" v-for="panel in area.container.items" :key="panel.id" />
  </div>
</template>
<script setup lang="ts">
import { computed, watch } from 'vue';
import { Area } from '../area';
import { Panel } from '../widget';
import { IPublicTypePanelConfig } from '@cc/lowcode-types';
const { area } = defineProps<{
  area: Area<IPublicTypePanelConfig, Panel>;
}>();
const style = computed(() => {
  const width = area.current?.config.props?.width;
  return width
    ? {
        width,
      }
    : {};
});
watch(
  () => area.visible,
  (newVal, oldVal) => console.log(area.name, oldVal, newVal)
);
</script>
