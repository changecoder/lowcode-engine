<template>
  <LowCodeRenderer 
    :schema="documentInstance.schema"
    :components="documentInstance.container.components"
  />
</template>
<script>
import LowCodeRenderer from '@cc/lowcode-vue-renderer'
import './renderer.less'

const props = defineProps(['rendererContainer'])
const documentInstance = props.rendererContainer.documentInstances[0]
</script>