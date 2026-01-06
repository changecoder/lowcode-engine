import { isVNode, h, cloneVNode } from 'vue';
import { VueNode } from '@cc/lowcode-types';

export function createContent(content: VueNode, props?: Record<string, unknown>): VueNode {
  if (typeof content === 'string') {
    return h('span', {}, content as string);
  }
  if (isVNode(content)) {
    return props ? cloneVNode(content, props) : content;
  }
  return h(content, props);
}
