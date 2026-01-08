<template>
  <div
    :class="['lc-titled-panel', {
      hidden: !panel.visible,
    }]"
    :id="area ? `${area}-${panel.name}` : panel.name"
    :data-keep-visible-while-dragging="panel.config.props?.keepVisibleWhileDragging"
  >
    <panel-operation-row  :panel="panel" />
    <div
      :class="['lc-panel-title', {
        actived: panel.actived,
      }]"
      :data-name="panel.name"
    >
      <editor-core-title :title="panel.title || panel.name" />
    </div>
    <div className="lc-panel-body">
      <component :is="panel.body" />
    </div>
    <draggable-line-view :panel="panel" />
  </div>
</template>
<script setup lang="ts">
  import { Title as EditorCoreTitle } from '@cc/lowcode-editor-core';
import { Panel } from '../../widget';
import { PanelOperationRow, DraggableLineView } from '.';
defineProps<{
  panel: Panel;
  area?: string;
}>()
</script>