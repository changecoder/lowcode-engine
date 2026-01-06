<template>
  <div :class="['lc-workbench', className]">
    <top-area :area="skeleton.topArea" :itemClassName="topAreaItemClassName" />
    <div class="lc-workbench-body">
      <left-area :area="skeleton.leftArea" />
    </div>
    <tip-container />
  </div>
</template>
<script lang="ts" setup>
  import { TipContainer } from '@cc/lowcode-editor-core'
import { ISkeleton } from '../skeleton';
import TopArea from './top-area.vue'
import LeftArea from './left-area.vue'
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
@import './theme.less';
:root {
  --font-family: @font-family;
  --font-size-label: @fontSize-4;
  --font-size-text: @fontSize-5;
  --font-size-btn-large: @fontSize-3;
  --font-size-btn-medium: @fontSize-4;
  --font-size-btn-small: @fontSize-5;

  --global-border-radius: @global-border-radius;
  --input-border-radius: @input-border-radius;
  --popup-border-radius: @popup-border-radius;

  --left-area-width: 48px;
  --workspace-left-area-width: 48px;
  --right-area-width: 300px;
  --top-area-height: 48px;
  --toolbar-height: 36px;
  --dock-pane-width: 300px;
  --dock-fixed-pane-width: 300px;
}

@media (min-width: 1860px) {
  :root {
    --right-area-width: 400px;
    --dock-pane-width: 452px;
    --dock-fixed-pane-width: 350px;
  }
}

html,
body {
  height: 100%;
  overflow: hidden;
  padding: 0;
  margin: 0;
  position: relative;
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  color: var(--color-text);
  background-color: var(--color-background);
}

* {
  box-sizing: border-box;
}
</style>