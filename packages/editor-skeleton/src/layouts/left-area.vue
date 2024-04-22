<template>
  <div v-if="isShow" :class="[area.visible ? 'lc-area-visible' : '', className]">
    <div class="lc-left-area-top">
      <div v-for="item in top" :key="`left-area-${item.name}`">
        <component :is="item.content" />
      </div>
    </div>
    <div class="lc-left-area-bottom">
      <div v-for="item in bottom" :key="`left-area-${item.name}`">
        <component :is="item.content" />
      </div>
    </div>
  </div>
</template>
<script setup>
const props = defineProps({
  area: Object,
  className: {
    type: String,
    default: () => 'lc-left-area'
  }
})
const isShow = !props.area.isEmpty()
const top = []
const bottom = []
props.area.container.items.slice().sort((a, b) => {
  const index1 = a.config?.index || 0
  const index2 = b.config?.index || 0
  return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1)
}).forEach((item) => {
  if (item.align === 'bottom') {
    bottom.push(item)
  } else {
    top.push(item)
  }
})
</script>