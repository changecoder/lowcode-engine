<template>
  <template v-if="panel.config?.area !== 'rightArea' && !panel?.config.props?.hideTitleBar">
    <template v-if="panel?.config.props?.canSetFixed !== false">
      <el-button text class="lc-pane-icon-fix" @click="setDisplay">
        <template v-if="areaName === 'leftFloatArea'">
          <icon-fix />
        </template>
        <template v-else>
          <icon-float />
        </template>
      </el-button>
    </template>
    <el-button text class="lc-pane-icon-close" @click="onClick">
      <el-icon><el-icon-close /></el-icon>
    </el-button>
  </template>
</template>
<script setup lang="ts">
import { ElButton, ElIcon } from 'element-plus';
import { Close as ElIconClose } from '@element-plus/icons-vue';
import { computed } from 'vue';
import { Panel } from '../../widget/panel';
import IconFix from '../../icons/fix.vue';
import IconFloat from '../../icons/float.vue';

const { panel } = defineProps<{ panel: Panel }>();
const setDisplay = () => {
  const current = panel;
  if (!current) {
    return;
  }
  panel.skeleton.toggleFloatStatus(panel);
};
const areaName = computed(() => panel?.parent?.name);
const onClick = () => {
  if (areaName.value) {
    (panel.skeleton as any)[areaName.value]?.setVisible(false);
  }
};
</script>
