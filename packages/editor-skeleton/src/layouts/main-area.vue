<template>
  <div class="lc-main-area engine-workspacepane">
    <component :is="item.content" v-for="item in area.container.items" :key="item.name" />
  </div>
</template>
<script setup lang="ts">
import { Area } from '../area';
import { Panel, Widget } from '../widget';

const { area } = defineProps<{
  area: Area<any, Panel | Widget>;
}>();
</script>
