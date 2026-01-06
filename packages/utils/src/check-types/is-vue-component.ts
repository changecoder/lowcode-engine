export const isVueComponent = (obj: any) => {
  if (!obj || typeof obj !== 'object') {
    return false;
  }
  // Vue 3 组件检查
  const vue3Indicators = ['__v_isVNode', '__v_skip', 'vnode', 'setup', 'render'];
  // Vue 2 组件检查
  const vue2Indicators = ['_isVue', '__v_skip', '_vnode', '$el', '$parent', '$children'];
  // 通用组件检查
  const commonIndicators = [
    '$props',
    '$attrs',
    '$emit',
    '$slots',
    '$scopedSlots',
    '$options',
    '$root',
    '$refs',
    '$watch',
    '$nextTick',
  ];
  // 检查是否包含 Vue 特定属性
  const allIndicators = [...vue2Indicators, ...vue3Indicators, ...commonIndicators];
  return allIndicators.some(key => key in obj);
};
