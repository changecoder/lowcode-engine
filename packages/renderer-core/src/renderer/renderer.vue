<script setup>
const props = defineProps(['schema', 'components'])

const RENDERER_COMPS = adapter.getRenderers()

const { schema, components } = props
const { componentName } = schema
const allComponents = { ...RENDERER_COMPS, ...components }

const Comp = allComponents[componentName] || RENDERER_COMPS[`${componentName}Renderer`]
</script>
<template>
  <Comp />
</template>