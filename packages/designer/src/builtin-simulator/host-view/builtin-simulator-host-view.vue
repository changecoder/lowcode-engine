<template>
  <div class="lc-simulator">
    <host-view-canvas :host="host" />
  </div>
</template>
<script setup lang="ts">
import { markRaw } from 'vue';
import HostViewCanvas from './canvas.vue';
import { BuiltinSimulatorHost } from '../host';
import { SimulatorHostProps } from './types';
import { Designer } from '../..';
const props = defineProps<SimulatorHostProps & { designer: Designer }>();
const { project, designer, onMount } = props;
const host =
  (project.simulator as BuiltinSimulatorHost) || new BuiltinSimulatorHost(project, designer);
host.setProps(markRaw(props));
onMount?.(host);
</script>
