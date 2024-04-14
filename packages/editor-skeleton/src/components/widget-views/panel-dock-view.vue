<template>
  <DockView 
    :className="[className, dock.actived ? 'actived' : '']"
    :onClick="() => { onClick?.(); dock.togglePanel();}"
    :icon="icon"
    :title="title"
    :description="description"
    :size="size"
  />
</template>
<script setup>
import DockView from './dock-view.vue'

const props = defineProps(['dock', 'className', 'onClick', 'title', 'icon', 'description', 'size'])
</script>