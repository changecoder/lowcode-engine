<template>
  <div :class="[area.visible ? 'lc-area-visible' : '', className, 'lc-top-area engine-actionpane']">
    <div class="lc-top-area-left"></div>
    <div class="lc-top-area-center"></div>
    <div class="lc-top-area-right"></div>
  </div>
</template>
<script setup>
const props = defineProps({
  area: Object,
  itemClassName: String,
  className: String
})
</script>