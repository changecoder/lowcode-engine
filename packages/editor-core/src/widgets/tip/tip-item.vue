<template>
  <div ref="shellRef" :class="className">
    <i class="lc-arrow" />
    <div class="lc-tip-content">
      {{ intl(tipHandler.tip?.children) }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { onUnmounted, ref } from 'vue';
import { IPublicTypeTipConfig } from '@cc/lowcode-types';
import { tipHandler } from './tip-handler';
import { intl } from '../../intl';
import { resolvePosition } from './utils';

const tip: IPublicTypeTipConfig = tipHandler.tip || ({} as any);
const shellRef = ref<HTMLElement>();
const className = `lc-tip ${tip.className || ''}` + (tip?.theme ? `lc-theme-${tip.theme}` : '');

let timer: number | null = null;

const clearTimer = () => {
  if (timer) {
    clearTimeout(timer);
    timer = null;
  }
};

const updateTip = () => {
  const shell = shellRef.value;
  if (!shell) {
    return;
  }
  const arrow = shell.querySelector('.lc-arrow') as HTMLElement;
  shell.className = className;
  shell.style.cssText = '';
  arrow.style.cssText = '';
  clearTimer();

  const { tip } = tipHandler;
  if (!tip) {
    return;
  }
  const { target, direction } = tip;
  const targetRect = target.getBoundingClientRect();
  if (targetRect.width === 0 || targetRect.height === 0) {
    return;
  }
  const shellRect = shell.getBoundingClientRect();
  const bounds = {
    left: 1,
    top: 1,
    right: document.documentElement.clientWidth - 1,
    bottom: document.documentElement.clientHeight - 1,
  };
  const arrowRect = arrow.getBoundingClientRect();
  const { dir, left, top, arrowLeft, arrowTop } = resolvePosition(
    shellRect,
    targetRect,
    arrowRect,
    bounds,
    direction
  );
  shell.classList.add(`lc-align-${dir}`);
  shell.style.top = `${top}px`;
  shell.style.left = `${left}px`;
  shell.style.width = `${shellRect.width}px`;
  shell.style.height = `${shellRect.height}px`;

  if (dir === 'top' || dir === 'bottom') {
    arrow.style.left = `${arrowLeft}px`;
  } else {
    arrow.style.top = `${arrowTop}px`;
    arrow.style.top = '1px';
  }

  shell.classList.add('lc-visible-animate');
  shell.style.transform = 'none';
};

const dispose = tipHandler.onChange(
  () =>
    (timer = window.setTimeout(() => {
      updateTip();
    }, 10))
);

onUnmounted(() => {
  dispose?.();
  clearTimer();
});
</script>
