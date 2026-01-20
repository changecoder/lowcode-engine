<template>
  <div class="lc-project">
    <div class="lc-simulator-shell">
      <component
        :is="designer.simulatorComponent || BuiltinSimulatorHostView"
        v-bind="designer.projectSimulatorProps"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { Designer } from '../designer';
import './project.less';
import { BuiltinSimulatorHostView } from '../builtin-simulator';
defineProps<{ designer: Designer }>();
</script>
