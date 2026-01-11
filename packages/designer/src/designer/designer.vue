<template>
  <div :class="['lc-designer', className]" :style="style">Project View</div>
</template>
<script setup lang="ts">
import { Designer, DesignerProps } from './designer';

defineProps<DesignerProps & { designer?: Designer }>();
</script>
