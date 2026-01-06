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
<style lang="less" scoped>
@import './theme.less';
.lc-top-area, .lc-workspace-sub-top-area {
  width: 100%;
  display: none;
  margin-bottom: 2px;
  padding: 8px 12px 8px 16px;

  &.lc-top-area {
    background-color: var(--color-top-area-background, var(--color-pane-background));
    height: var(--top-area-height);
  }

  &.lc-workspace-top-area {
    background-color: var(--color-workspace-top-area-background, var(--color-pane-background));
  }

  &.lc-workspace-sub-top-area {
    background-color: var(--color-workspace-sub-top-area-background, var(--color-pane-background));
    height: var(--workspace-sub-top-area-height, var(--top-area-height));
    margin: var(--workspace-sub-top-area-margin, 0px 0px 2px 0px);
    padding: var(--workspace-sub-top-area-padding, 8px 12px 8px 16px);
  }

  &.lc-area-visible {
    display: flex;
  }

  .lc-top-area-left, .lc-workspace-sub-top-area-left {
    display: flex;
    align-items: center;
    max-width: 100%;
  }

  .lc-top-area-center, .lc-workspace-sub-top-area-center {
    flex: 1;
    display: flex;
    justify-content: center;
    margin: 0 8px;
  }
  .lc-top-area-right, .lc-workspace-sub-top-area-right {
    display: flex;
    align-items: center;
    > * {
      margin-left: 4px;
      margin-right: 4px;
    }
    .ve-quick-search-trigger {
      display: flex;
    }
  }
}
</style>