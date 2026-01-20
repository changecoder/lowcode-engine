<template>
  <div :class="classValue" :style="canvas">
    <div ref="canvasRef" class="lc-simulator-canvas-viewport" :style="viewport">
      <host-view-content :host="host" />
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, onMounted, ref, type CSSProperties } from 'vue';
import { BuiltinSimulatorHost } from '../host';
import HostViewContent from './content.vue';
const props = defineProps<{ host: BuiltinSimulatorHost }>();
const { host: sim } = props;
const canvas = (sim.deviceStyle?.canvas ?? {}) as CSSProperties;
const viewport = (sim.deviceStyle?.viewport ?? {}) as CSSProperties;
const classValue = computed(() => {
  let className = 'lc-simulator-canvas';
  if (sim.deviceClassName) {
    className += ` ${sim.deviceClassName}`;
  } else if (sim.device) {
    className += ` lc-simulator-device-${sim.device}`;
  }
  return className;
});
const canvasRef = ref<HTMLElement | null>(null);
onMounted(() => {
  sim.mountViewport(canvasRef.value);
});
</script>
