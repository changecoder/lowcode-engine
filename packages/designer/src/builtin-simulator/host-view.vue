<template>
  <div class="lc-simulator">
    <div :ref="el => host.mountViewport(el as HTMLElement)" class="lc-simulator-canvas-viewport">
      <div class="lc-simulator-canvas-viewport">
        <div className="lc-simulator-content">
          <iframe ref="frameRef" />
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { BuiltinSimulatorHost, BuiltinSimulatorProps } from './host';
import { Project } from '../project';
import { Designer } from '../designer';
const { project, designer } = defineProps<
  BuiltinSimulatorProps & { project: Project; designer: Designer }
>();
const host =
  (project.simulator as BuiltinSimulatorHost) || new BuiltinSimulatorHost(project, designer);
const frameRef = ref<HTMLIFrameElement | null>(null);
onMounted(() => {
  host.mountContentFrame(frameRef.value);
});
</script>
