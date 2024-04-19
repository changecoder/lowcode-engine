<template>
  <div :class="['lc-designer', className]">
    <ProjectView />
  </div>
</template>
<script setup>
import { ProjectView } from '../project'

defineProps(['className'])
</script>