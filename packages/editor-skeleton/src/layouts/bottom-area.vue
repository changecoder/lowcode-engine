<template>
  <div :class="['lc-bottom-area', { 'lc-area-visible': area.visible }]">
    <component :is="panel.content" v-for="panel in area.container.items" :key="panel.id" />
  </div>
</template>
<script setup lang="ts">
import { Area } from '../area';
import { Panel } from '../widget';
const { area } = defineProps<{
  area: Area<any, Panel>;
}>();
</script>
