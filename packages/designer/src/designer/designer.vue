<template>
  <div :class="['lc-designer', className || '']">
    <project-view :designer="designerValue" />
  </div>
</template>
<script setup lang="ts">
import { Designer, DesignerProps } from './designer';
import { ProjectView } from '../project';
import { computed } from 'vue';
import './designer.less';
const { designer = undefined, ...designerProps } = defineProps<
  DesignerProps & { designer?: Designer }
>();
const designerValue = computed(() => {
  if (designer) {
    designer.setProps(designerProps);
    return designer;
  }
  return new Designer(designerProps);
});
</script>