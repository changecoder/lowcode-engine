<template>
  <template v-if="isVNode(title)">
    <component :is="title" />
  </template>
  <span
    v-else-if="!!title"
    :class="['lc-title', className, { 'has-tip': !!data.tip, 'only-icon': !data._title.label }]"
    @click="handleClick"
  >
    <b v-if="!!data.icon" class="lc-title-icon">
      <component :is="data.icon" />
    </b>
    <component :is="renderLabel(data._title.label)" />
    <component :is="data.tip" />
  </span>
</template>
<script setup lang="ts">
import { VNode, computed, h, isVNode } from 'vue';
import {
  IPublicTypeI18nData,
  IPublicTypeTitleConfig,
  IPublicTypeTitleProps,
} from '@cc/lowcode-types';
import { intl } from '../../intl';
import { createIcon, isI18nData, isTitleConfig } from '@cc/lowcode-utils';
import { splitLabelByKeywords } from '../../utils/split-label-by-keywords';
import { Tip } from '..';
const { title, onClick, match, keywords } = defineProps<IPublicTypeTitleProps>();

const handleClick = (e: MouseEvent) => {
  const url = title && ((title as IPublicTypeTitleConfig).docUrl || (title as any).url);
  if (url) {
    window.open(url);
    // 防止触发行操作（如折叠面板）
    e.stopPropagation();
  }
  onClick?.(e);
};
const renderLabel = (label: string | IPublicTypeI18nData | VNode) => {
  if (isVNode(label)) {
    return label;
  }

  if (!label) {
    return null;
  }

  const intlLabel = intl(label);

  if (typeof intlLabel !== 'string') {
    return h('span', { class: 'lc-title-txt' }, intlLabel as any);
  }

  let labelToRender: any = intlLabel;

  if (match && keywords) {
    const fragments = splitLabelByKeywords(intlLabel as string, keywords);

    labelToRender = fragments.map((f: string) =>
      h('span', { style: { color: f === keywords ? 'red' : 'inherit' } })
    );
  }

  return h('span', { className: 'lc-title-txt' }, labelToRender);
};
const data = computed(() => {
  let _title: any = { label: title };
  if (isTitleConfig(title)) {
    _title = title;
  }
  const icon = _title.icon ? createIcon(_title.icon, { size: 20 }) : null;
  let tip: any = null;
  if (_title.tip) {
    if (isVNode(_title.tip) && _title.tip.type === Tip) {
      tip = _title.tip;
    } else {
      const tipProps =
        typeof _title.tip === 'object' && !(isVNode(_title.tip) || isI18nData(_title.tip))
          ? _title.tip
          : { children: _title.tip };
      tip = h(Tip, { ...tipProps });
    }
  }
  return { icon, _title, tip };
});
</script>
<style lang="less">
@import url('./title.less');
</style>
