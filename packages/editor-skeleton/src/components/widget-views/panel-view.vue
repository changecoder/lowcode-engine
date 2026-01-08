<template>
  <div 
    :class="['lc-panel', { hidden: !panel.visible }]"
    :id="area ? `${area}-${panel.name}` : panel.name"
    :data-keep-visible-while-dragging="panel.config.props?.keepVisibleWhileDragging"
  >
    <panel-operation-row v-if="!hideOperationRow" :panel="panel" />
    <component :is="panel.body" />
    <draggable-line-view v-if="!hideDragLine" :panel="panel" />
  </div>
</template>
<script setup lang="ts">
import { Panel } from '../../widget';
import { PanelOperationRow, DraggableLineView } from '.';
defineProps<{
  panel: Panel;
  area?: string;
  hideOperationRow?: boolean;
  hideDragLine?: boolean;
}>()
</script>