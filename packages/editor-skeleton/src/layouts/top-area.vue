<template>
  <div 
    v-if="hasData"
    :class="{
      'lc-top-area engine-actionpane': true,
      'lc-area-visible': area.visible,
    }"
  >
    <div class="lc-top-area-left">
      <template v-for="item in data.left">
        <component :is="item" />
      </template>
    </div>
    <div class="lc-top-area-center">
      <template v-for="item in data.center">
        <component :is="item" />
      </template>
    </div>
    <div class="lc-top-area-right">
      <template v-for="item in data.right">
        <component :is="item" />
      </template>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { h, computed } from 'vue'
import { Area } from '../area'
import { TopAreaData } from '../types'

const { area, itemClassName }= defineProps<{
  area: Area,
  itemClassName?: string
}>()
const hasData = computed(() => area.container.items.length !== 0)
const data = computed(() => area.container.items.slice().sort((a, b) => {
  const index1 = a.config?.index || 0
  const index2 = b.config?.index || 0
  return index1 === index2 ? 0 : (index1 > index2 ? 1 : -1)
}).reduce((prev, cur) => {
  const content = h('div', { class: itemClassName || '', key: `top-area-${cur.name}` }, cur.content)
  if (cur.align === 'center') {
    prev.center.push(content)
  } else if (cur.align === 'left') {
    prev.left.push(content);
  } else {
    prev.right.push(content);
  }
  return prev
}, { left: [], center: [], right: []} as TopAreaData))
</script>