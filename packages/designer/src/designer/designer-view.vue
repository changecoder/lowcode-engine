<template>
  <div :class="['lc-designer', className]">
    <ProjectView :designer="designerState"/>
  </div>
</template>
<script setup>
import { useAttrs } from 'vue'

import { ProjectView } from '../project'
import { Designer } from './designer'

const props = defineProps(['className', 'designer'])

const designerProps = useAttrs()

let designerState
if (designerState) {
  designerState = props.designer
  designerState.setProps(designerProps)
} else {
  designerState= new Designer(designerProps)
}
</script>
<style lang="less">
.lc-designer {
  position: relative;
  font-family: var(--font-family);
  font-size: var(--font-size-text);
  box-sizing: border-box;

  * {
    box-sizing: border-box;
  }
}
</style>