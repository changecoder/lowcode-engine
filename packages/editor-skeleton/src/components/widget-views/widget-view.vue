<template>
  <template v-if="widget.visible">
      <template v-if="widget.disabled">
        <div  class='lc-widget-disabled'>
          <component :is="widget.body" />
        </div>
      </template>
      <template v-else>
        <component :is="widget.body" />
      </template>
  </template>
</template>
<script lang="ts" setup>
import { IWidget } from '../../widget'

defineProps<{
  widget: IWidget
}>()
</script>