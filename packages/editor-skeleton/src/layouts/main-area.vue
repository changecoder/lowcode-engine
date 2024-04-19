<template>
  <div class="lc-main-area engine-workspacepane">
    <component v-for="item in area.container.items" :is="item.content" />
  </div>
</template>
<script setup>
defineProps(['area'])
</script>