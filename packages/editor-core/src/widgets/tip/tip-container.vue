<template>
  <Teleport to="body">
    <div className="lc-tips-container">
      <TipItem />
    </div>
  </Teleport>
</template>
<script setup lang="ts">
import { Teleport, onMounted, onUnmounted } from 'vue'
import TipItem from './tip-item.vue'
import { tipHandler } from './tip-handler'
let dispose: Function
onMounted(() => {
  const over = (e: MouseEvent) => tipHandler.setTarget(e.target as any)
  const down = () => tipHandler.hideImmediately()
  document.addEventListener('mouseover', over, false)
  document.addEventListener('mousedown', down, true)
  dispose = () => {
    document.removeEventListener('mouseover', over, false)
    document.removeEventListener('mousedown', down, true)
  }
})
onUnmounted(() => {
  dispose?.()
})
</script>