<template>
  <DockView 
    :className="['dock-view', className, dock?.actived ? 'actived' : '']"
    :onClick="clickHandler"
    :icon="icon"
    :title="title"
    :description="description"
    :size="size"
  />
</template>
<script setup>
import { watch } from 'vue'
import DockView from './dock-view.vue'
const props = defineProps(['dock', 'className', 'onClick', 'title', 'icon', 'description', 'size'])
const clickHandler = () => {
  props.onClick?.()
  props.dock.togglePanel()
}
</script>