<template>
  <dock-view 
    v-bind="props" 
    :className="`${className} ${dock.actived ? 'actived' : ''}`"
    :onClick="onClickProp"
  />
</template>
<script setup lang="ts">
import { IPublicTypePanelDockProps } from '@cc/lowcode-types';
import { PanelDock } from '../../widget';
import DockView from './dock-view.vue';
const { dock, className, onClick, ...props } = defineProps<IPublicTypePanelDockProps & {
  dock: PanelDock
}>()
const onClickProp = () => {
  onClick?.()
  dock.togglePanel()
}
</script>