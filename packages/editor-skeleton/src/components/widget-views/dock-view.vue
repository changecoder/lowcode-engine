<template>
  <Title
    :title="composeTitle"
    :class="['lc-dock', className, size ? `lc-dock-${size}` : '']"
    :onClick="onClick"
  />
</template>
<script setup>
import { Title } from '@cc/lowcode-editor-core'

const props = defineProps(['title', 'icon', 'description', 'size', 'className', 'onClick'])
const { title, icon, description } = props
const composeTitle = {
  label: title,
  icon,
  tip: description
}
</script>