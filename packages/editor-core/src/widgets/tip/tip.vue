<template>
  <meta data-role="tip" :data-tip-id="id">
</template>
<script setup lang="ts">
import { onUnmounted } from 'vue'
import { IPublicTypeTipConfig } from '@cc/lowcode-types'
import { uniqueId } from '@cc/lowcode-utils'
import { postTip } from './tip-handler'
const id = uniqueId('tips$')
const props = defineProps<IPublicTypeTipConfig>()
postTip(id, props)
onUnmounted(() => {
  postTip(id, null)
})
</script>