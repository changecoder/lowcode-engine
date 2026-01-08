<template>
  <div :class="['lc-workbench', className]">
    <top-area :area="skeleton.topArea" :itemClassName="topAreaItemClassName" />
    <div class="lc-workbench-body">
      <left-area :area="skeleton.leftArea" />
      <left-float-pane :area="skeleton.leftFloatArea" />
      <left-fixed-pane :area="skeleton.leftFixedArea" />
    </div>
    <tip-container />
  </div>
</template>
<script lang="ts" setup>
import { TipContainer } from '@cc/lowcode-editor-core'
import { ISkeleton } from '../skeleton';
import TopArea from './top-area.vue'
import LeftArea from './left-area.vue'
import LeftFloatPane from './left-float-pane.vue'
import LeftFixedPane from './left-fixed-pane.vue'
defineProps<{
  skeleton: ISkeleton,
  className?: string,
  topAreaItemClassName?: string
}>()
</script>
<style lang="less" scoped>
@import './theme.less';
.lc-workbench {
  height: 100%;
  display: flex;
  flex-direction: column;
  background-color: var(--color-background);
}
.lc-workbench-body {
  flex: 1;
  display: flex;
  min-height: 0;
  position: relative;
}
</style>
<style lang="less">
@import './workbench.less';
</style>