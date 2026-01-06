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
<style lang="less" scoped>
@import './theme.less';
.lc-left-area {
  height: 100%;
  width: var(--left-area-width);
  display: none;
  flex-shrink: 0;
  flex-direction: column;
  justify-content: space-between;
  overflow: hidden;
  background-color: var(--color-left-area-background, var(--color-pane-background));

  &.lc-workspace-left-area {
    background-color: var(--color-workspace-left-area-background, var(--color-pane-background));
  }
  &.lc-area-visible {
    display: flex;
  }
  .lc-left-area-top,
  .lc-left-area-bottom {
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: center;
    color: var(--color-text);

    .lc-title {
      flex-direction: column;
      width: calc(var(--left-area-width) - 2px);
      height: 46px;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;

      &.has-tip {
        cursor: pointer;
      }
      &.actived {
        color: var(--color-brand, #0079f2);
      }
      &.disabled {
        opacity: 0.4;
      }
      .lc-title-icon {
        height: 20px;
        width: 20px;
        margin: 0;
        .next-icon:before {
          line-height: 1 !important;
        }
      }
    }
  }
  .lc-left-area-top {
    padding-top: 12px;
  }
  .lc-left-area-bottom {
    padding-bottom: 12px;
  }
}
</style>