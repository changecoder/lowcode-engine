<template>
  <div :class="['lc-workbench', className]">
    <top-area :area="skeleton.topArea" :item-class-name="topAreaItemClassName" />
    <div class="lc-workbench-body">
      <left-area :area="skeleton.leftArea" />
      <left-float-pane :area="skeleton.leftFloatArea" />
      <left-fixed-pane :area="skeleton.leftFixedArea" />
      <div class="lc-workbench-center">
        <toolbar :area="skeleton.toolbar" />
        <main-area :area="skeleton.mainArea" />
        <bottom-area :area="skeleton.bottomArea" />
      </div>
    </div>
    <tip-container />
  </div>
</template>
<script lang="ts" setup>
import { TipContainer } from '@cc/lowcode-editor-core';
import { ISkeleton } from '../skeleton';
import TopArea from './top-area.vue';
import LeftArea from './left-area.vue';
import LeftFloatPane from './left-float-pane.vue';
import LeftFixedPane from './left-fixed-pane.vue';
import Toolbar from './toolbar.vue';
import MainArea from './main-area.vue';
import BottomArea from './bottom-area.vue';
import './workbench.less';
defineProps<{
  skeleton: ISkeleton;
  className?: string;
  topAreaItemClassName?: string;
}>();
</script>
