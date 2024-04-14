<template>
  <span
    :class="['lc-title', className, { 'has-tip': !!tip }, { 'only-icon': !title.label }]"
    @click="handleClick"
  >
    <b class="lc-title-icon">{{ title.icon }}</b>
  </span>
</template>
<script setup>
const props = defineProps(['title', 'className', 'tip', 'onClick'])

const handleClick = (e) => {
  props.onClick?.(e)
}
</script>