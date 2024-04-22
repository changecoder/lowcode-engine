<template>
  <div class="lowcode-plugin-designer">
    <DesignerView
      className="lowcode-plugin-designer"
      :designer="engineEditor.get('designer')"
    />
  </div>
</template>
<script setup>
import { DesignerView } from '@cc/lowcode-designer'
defineProps(['engineEditor'])
</script>
<style>
.lowcode-plugin-designer {
  width: 100%;
  height: 100%;
}
</style>