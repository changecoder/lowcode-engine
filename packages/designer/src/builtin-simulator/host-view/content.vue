<template>
  <div class="lc-simulator-content">
    <iframe
      ref="frameRef"
      :name="`${props.host.designer.viewName}-SimulatorRenderer`"
      class="lc-simulator-content-frame"
      :style="frameStyle"
    />
  </div>
</template>
<script setup lang="ts">
import { onMounted, reactive, onUnmounted, computed, ref } from 'vue';
import { BuiltinSimulatorHost } from '../host';
const props = defineProps<{ host: BuiltinSimulatorHost }>();
const state = reactive({
  disabledEvents: false,
});
const frameRef = ref<HTMLIFrameElement | null>(null);

let dispose: () => void;

onMounted(() => {
  const editor = props.host.designer.editor;
  const onEnableEvents = (type: boolean) => {
    state.disabledEvents = type;
  };
  editor.eventBus.on('designer.builtinSimulator.disabledEvents', onEnableEvents);
  props.host.mountContentFrame(frameRef.value);

  dispose = () => {
    editor.removeListener('designer.builtinSimulator.disabledEvents', onEnableEvents);
  };
});

onUnmounted(() => dispose?.());

const frameStyle = computed(() => {
  const { viewport } = props.host;
  const base: any = {
    transform: `scale(${viewport.scale})`,
    height: viewport.contentHeight,
    width: viewport.contentWidth,
  };
  if (state.disabledEvents) {
    base.pointerEvents = 'none';
  }
  return base;
});
</script>
