<template>
  <dock-view 
    v-bind="props" 
    :className="`${className} ${dock.actived ? 'actived' : ''}`"
    :onClick="onClickProp"
  />
</template>
<script setup lang="ts">
import { PanelDock } from '../../widget';
import DockView from './dock-view.vue';
import { DockProps } from '../../types';
const { dock, className, onClick, ...props } = defineProps<DockProps & {
  dock: PanelDock
}>()
const onClickProp = () => {
  onClick?.()
  dock.togglePanel()
}
</script>