<template>
  <div v-if="!widget.disabled && widget.visible" class="lc-widget-disabled">
    <component :is="widget.body" />
  </div>
</template>
<script setup>
defineProps(['widget'])
</script>