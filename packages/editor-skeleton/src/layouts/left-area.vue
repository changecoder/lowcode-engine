<template>
  <div 
    v-if="hasData"
    :class="{'lc-left-area': true, 'lc-area-visible': area.visible }"
  >
    <div className="lc-left-area-top">
      <template v-for="item in data.top">
        <component :is="item" />
      </template>
    </div>
    <div className="lc-left-area-bottom">
      <template v-for="item in data.bottom">
        <component :is="item" />
      </template>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed, h } from 'vue'
import { Area } from '../area'
import { LeftAreaData } from '../types'

const { area } = defineProps<{
  area: Area
}>()
const hasData = computed(() => area.container.items.length !== 0)
const data = computed(() => area.container.items.slice().sort((a, b) => {
  const index1 = a.config?.index || 0
  const index2 = b.config?.index || 0
  return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1)
}).reduce((prev, cur) => {
  const content = h('div', { key: `left-area-${cur.name}` }, cur.content)
  if (cur.align === 'bottom') {
    prev.bottom.push(content)
  } else {
    prev.top.push(content);
  }
  return prev
}, { bottom: [], top: [], right: []} as LeftAreaData))
</script>