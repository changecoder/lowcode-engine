<template>
  <div :class="['lc-workbench', className || '']">
    <TopArea :area="skeleton.topArea" :itemClassName="topAreaItemClassName" />
    <div class="lc-workbench-body">
      <LeftArea :area="skeleton.leftArea" />
      <LeftFloatPane :area="skeleton.leftFloatArea" />
      <div class="lc-workbench-center">
        <MainArea :area="skeleton.mainArea" />
      </div>
    </div>
  </div>
</template>
<script setup>
import TopArea from './top-area.vue'
import LeftArea from './left-area.vue'
import LeftFloatPane from './left-float-pane.vue'
import MainArea from './main-area.vue'

import './workbench.less'

const props = defineProps({
  className: String,
  config: Object,
  components: Object,
  skeleton: Object,
  topAreaItemClassName: String
})

props.skeleton.buildFromConfig(props.config, props.components)
</script>
