import { cloneVNode, h, isVNode, VNodeChild } from 'vue';
import { ElIcon } from 'element-plus';
import * as Icons from '@element-plus/icons-vue';
import { IPublicTypeIconType } from '@cc/lowcode-types';
import { isVueComponent } from './check-types';

const URL_RE = /^(https?:)\/\//i;

export const createIcon = (
  icon?: IPublicTypeIconType | null,
  props?: Record<string, unknown>
): VNodeChild => {
  if (!icon) {
    return null;
  }
  if (typeof icon === 'string') {
    if (URL_RE.test(icon)) {
      return h('img', {
        src: icon,
        class: props?.className,
        ...props,
      });
    }
    return h(
      ElIcon,
      { ...props },
      {
        default: () => h((Icons as any)[icon]),
      }
    );
  }
  if (isVNode(icon)) {
    return cloneVNode(icon, { ...props });
  }
  if (isVueComponent(icon)) {
    return h(icon, { ...props });
  }
};
