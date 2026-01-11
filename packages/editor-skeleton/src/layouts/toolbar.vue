<template>
  <div v-if="hasData" :class="['lc-toolbar', { 'lc-area-visible': area.visible }]">
    <div class="lc-toolbar-left">
      <component :is="item" v-for="(item, index) in data.left" :key="index" />
    </div>
    <div class="lc-toolbar-center">
      <component :is="item" v-for="(item, index) in data.center" :key="index" />
    </div>
    <div class="lc-toolbar-right">
      <component :is="item" v-for="(item, index) in data.right" :key="index" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { h, computed } from 'vue';
import { Area } from '../area';
import { TopAreaData } from '../types';

const { area, itemClassName = '' } = defineProps<{
  area: Area;
  itemClassName?: string;
}>();
const hasData = computed(() => area.container.items.length !== 0);
const data = computed(() =>
  area.container.items.reduce(
    (prev, cur) => {
      const content = h('div', { class: itemClassName, key: `top-area-${cur.name}` }, cur.content);
      if (cur.align === 'center') {
        prev.center.push(content);
      } else if (cur.align === 'right') {
        prev.right.push(content);
      } else {
        prev.left.push(content);
      }
      return prev;
    },
    { left: [], center: [], right: [] } as TopAreaData
  )
);
</script>
