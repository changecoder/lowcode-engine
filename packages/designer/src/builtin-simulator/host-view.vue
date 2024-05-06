<template>
  <div class="lc-simulator">
    <div class="lc-simulator-canvas">
        <div class="lc-simulator-canvas-viewport">
          <div class="lc-simulator-content">
            <iframe
              ref="frame"
              class="lc-simulator-content-frame"
            />
          </div>
        </div>
      </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from 'vue'
import { BuiltinSimulatorHost } from './host'
const frame = ref(null)
const props = defineProps(['project', 'designer', 'onMount'])
const host = props.project.simulator || new BuiltinSimulatorHost(props.project, props.designer)
host.setProps(props)
props.onMount?.(host)
onMounted(() => {
  host.mountContentFrame(frame.value)
})

</script>