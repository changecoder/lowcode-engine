<template>
  <editor-title
    :title="titleProp"
    :className="classNameProp"
    @click="onClick"
  />
</template>
<script setup lang="ts">
import { computed } from 'vue';
import { Title as EditorTitle } from '@cc/lowcode-editor-core';
import { composeTitle } from '../../widget/utils';
import { DockProps } from '../../types';
const {title, icon, size, description, onClick, className } = defineProps<DockProps>();
const titleProp = computed(() => composeTitle(title, icon, description));
const classNameProp = computed(() => {
  return 'lc-dock ' + className + (size ? ` lc-dock-${size}` : '');
});
</script>