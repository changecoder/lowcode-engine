<template>
  <div 
    :class="['lc-left-float-pane', area.visible ? 'lc-area-visible' : '']"
  >
    <component v-for="panel in area.container.items" :is="panel.content" />
  </div>
</template>
<script setup>
defineProps(['area'])
</script>